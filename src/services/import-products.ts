import { parse } from "csv-parse/sync";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/slug";
import { syncProductsToSearch } from "@/lib/search";

type RawRow = Record<string, string | undefined>;

function numberValue(value: string | undefined, fallback = 0) {
  if (!value) return fallback;
  const clean = value.replace(/,/g, "").trim();
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function textValue(value: string | undefined) {
  return (value || "").trim();
}

export function parseProductCsv(csvText: string): RawRow[] {
  return parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true
  }) as RawRow[];
}

export async function createImportBatch(filename: string | undefined, rows: RawRow[], priceTiers?: any) {
  const batchId = randomUUID();

  const getMultiplierForPrice = (price: number) => {
    if (!priceTiers) return 1;
    let pct = 0;
    if (price < 10) pct = Number(priceTiers.tier1);
    else if (price >= 10 && price < 25) pct = Number(priceTiers.tier2);
    else if (price >= 25 && price < 50) pct = Number(priceTiers.tier3);
    else if (price >= 50 && price < 75) pct = Number(priceTiers.tier4);
    else if (price >= 75 && price <= 100) pct = Number(priceTiers.tier5);
    else if (price > 100) pct = Number(priceTiers.tier6);
    
    if (!pct || isNaN(pct)) return 1;
    return 1 + (pct / 100);
  };

  await prisma.productImportBatch.create({
    data: {
      id: batchId,
      filename,
      status: "PENDING",
      totalRows: rows.length,
      rows: {
        createMany: {
          data: rows.map((row, index) => {
            const handle = textValue(row.Handle || row.slug);
            const title = textValue(row.Title || row.title || row.name);
            const sku = textValue(row['Variant SKU'] || row.sku || row.SKU);
            const barcode = textValue(row['Variant Barcode'] || row.barcode || row.Barcode);
            const slug = handle || makeSlug(`${title}-${sku}`);
            const categoryName = textValue(row['Custom Product Type'] || row['Standardized Product Type'] || row.categoryName || row.category || "Default Category");
            const categorySlug = textValue(row.categorySlug) || makeSlug(categoryName);
            const brandName = textValue(row.Vendor || row.brandName || row.brand || "Default Brand");
            const brandSlug = textValue(row.brandSlug) || makeSlug(brandName);

            const rawPrice = numberValue(row['Variant Price'] || row.price);
            const multiplier = getMultiplierForPrice(rawPrice);
            const rawSalePrice = (row['Variant Compare At Price'] || row.salePrice) ? numberValue(row['Variant Compare At Price'] || row.salePrice) : undefined;

            return {
              rowNumber: index + 1,
              sku,
              barcode,
              title,
              slug,
              categoryName,
              categorySlug,
              brandName,
              brandSlug,
              price: rawPrice * multiplier,
              salePrice: rawSalePrice ? rawSalePrice * multiplier : undefined,
              stockQuantity: numberValue(row['Variant Inventory Qty'] || row.stockQuantity || row.stock || "0"),
              imageUrl: textValue(row['Image Src'] || row.imageUrl || row.image),
              variantImage: textValue(row['Variant Image'] || row.variantImage),
              seoTitle: textValue(row.seoTitle || title),
              seoDescription: textValue(row.seoDescription),
              rawData: row,
              errorMessage: !slug ? "Missing Handle/Slug - cannot group product" : null
            };
          })
        }
      }
    }
  });

  return batchId;
}

export async function processImportBatch(batchId: string) {
  const chunkSize = Number(process.env.IMPORT_CHUNK_SIZE || 5000);
  let successRows = 0;
  let failedRows = 0;
  let processed = 0;

  await prisma.productImportBatch.update({
    where: { id: batchId },
    data: { status: "PROCESSING", message: "Import processing started" }
  });

  while (true) {
    const rows = await prisma.productImportRow.findMany({
      where: { batchId, processedAt: null },
      orderBy: { rowNumber: "asc" },
      take: chunkSize
    });

    if (rows.length === 0) break;

    const validRows = [];
    const invalidRows = [];
    for (const row of rows) {
      if (row.errorMessage || !row.slug) {
        invalidRows.push(row);
      } else {
        validRows.push(row);
      }
    }

    // Process invalid rows sequentially to avoid pool exhaustion
    for (const row of invalidRows) {
      failedRows += 1;
      await prisma.productImportRow.update({
        where: { id: row.id },
        data: { processedAt: new Date() }
      });
    }

    if (validRows.length > 0) {
      try {
        const uniqueCategories = Array.from(new Map(validRows.map(r => [r.categorySlug || "default-category", { slug: r.categorySlug || "default-category", name: r.categoryName || "Default Category" }])).values());
        for (const cat of uniqueCategories) {
          await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: { slug: cat.slug, name: cat.name }
          });
        }
        
        const uniqueBrands = Array.from(new Map(validRows.map(r => [r.brandSlug || "default-brand", { slug: r.brandSlug || "default-brand", name: r.brandName || "Default Brand" }])).values());
        for (const brand of uniqueBrands) {
          await prisma.brand.upsert({
            where: { slug: brand.slug },
            update: { name: brand.name },
            create: { slug: brand.slug, name: brand.name }
          });
        }

        const categories = await prisma.category.findMany({ where: { slug: { in: uniqueCategories.map(c => c.slug) } } });
        const brands = await prisma.brand.findMany({ where: { slug: { in: uniqueBrands.map(b => b.slug) } } });
        const categoryMap = new Map(categories.map(c => [c.slug, c.id]));
        const brandMap = new Map(brands.map(b => [b.slug, b.id]));

        // GROUP BY SLUG
        const groups = new Map<string, typeof validRows>();
        for (const row of validRows) {
          if (!groups.has(row.slug!)) groups.set(row.slug!, []);
          groups.get(row.slug!)!.push(row);
        }

        const groupedValues = Array.from(groups.values());
        const productSubChunkSize = 25; // Safer chunk size for Prisma pool
        const allUpsertedProducts = [];
        
        for (let i = 0; i < groupedValues.length; i += productSubChunkSize) {
          const chunk = groupedValues.slice(i, i + productSubChunkSize);
          
          const upsertedChunk = await Promise.all(chunk.map(async groupRows => {
            try {
              const parentRow = groupRows.find(r => r.title) || groupRows[0];
              const rawData = parentRow.rawData as any;
              let descriptionHtml = rawData ? (rawData['Body (HTML)'] || rawData.description || rawData.body || null) : null;
              
              const variantRows = groupRows.filter(r => r.sku); // Rows with a SKU are variants
              
              const basePriceVal = variantRows.length > 0 
                  ? Math.min(...variantRows.map(r => r.price ? Number(r.price) : 0).filter(p => p > 0)) 
                  : (parentRow.price ? Number(parentRow.price) : 0);
              
              const targetStatus = basePriceVal <= 0 ? "DRAFT" : "ACTIVE";
              const totalStock = variantRows.reduce((acc, r) => acc + (r.stockQuantity || 0), 0) || parentRow.stockQuantity || 0;
              
              const allImages = groupRows.flatMap(r => [r.imageUrl, r.variantImage]).filter(Boolean) as string[];
              const uniqueImages = Array.from(new Set(allImages));
              const mainImage = uniqueImages.length > 0 ? uniqueImages[0] : null;

              const catId = categoryMap.get(parentRow.categorySlug || "default-category");
              const bndId = brandMap.get(parentRow.brandSlug || "default-brand");

              const product = await prisma.product.upsert({
                where: { slug: parentRow.slug! },
                update: {
                  title: parentRow.title || "Unnamed Product",
                  description: descriptionHtml,
                  basePrice: basePriceVal,
                  stockQuantity: totalStock,
                  stockStatus: totalStock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
                  mainImage: mainImage,
                  seoTitle: parentRow.seoTitle || parentRow.title,
                  seoDescription: parentRow.seoDescription || null,
                  categoryId: catId,
                  brandId: bndId,
                  status: targetStatus,
                  importBatchId: batchId
                },
                create: {
                  sku: parentRow.sku || `base-${parentRow.slug}`,
                  barcode: parentRow.barcode || null,
                  slug: parentRow.slug!,
                  title: parentRow.title || "Unnamed Product",
                  description: descriptionHtml,
                  shortDescription: parentRow.seoDescription || null,
                  basePrice: basePriceVal,
                  stockQuantity: totalStock,
                  stockStatus: totalStock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
                  mainImage: mainImage,
                  seoTitle: parentRow.seoTitle || parentRow.title,
                  seoDescription: parentRow.seoDescription || null,
                  categoryId: catId,
                  brandId: bndId,
                  status: targetStatus,
                  importBatchId: batchId
                },
                include: { category: true, brand: true }
              });

              // Process Variants
              for (const vRow of variantRows) {
                const vRaw = vRow.rawData as any;
                const attrs: Record<string, string> = {};
                
                const addOption = (nameKey: string, valKey: string) => {
                  const name = vRaw[nameKey];
                  const val = vRaw[valKey];
                  if (name && val && !(name === 'Title' && val === 'Default Title')) {
                    attrs[name] = val;
                  }
                };
                
                addOption('Option1 Name', 'Option1 Value');
                addOption('Option2 Name', 'Option2 Value');
                addOption('Option3 Name', 'Option3 Value');

                await prisma.productVariant.upsert({
                  where: { sku: vRow.sku! },
                  update: {
                    productId: product.id,
                    price: vRow.price || 0,
                    barcode: vRow.barcode || null,
                    salePrice: vRow.salePrice,
                    stockQuantity: vRow.stockQuantity || 0,
                    stockStatus: (vRow.stockQuantity || 0) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
                    image: vRow.variantImage || vRow.imageUrl || null,
                    attributes: Object.keys(attrs).length > 0 ? attrs : undefined
                  },
                  create: {
                    productId: product.id,
                    sku: vRow.sku!,
                    barcode: vRow.barcode || null,
                    price: vRow.price || 0,
                    salePrice: vRow.salePrice,
                    stockQuantity: vRow.stockQuantity || 0,
                    stockStatus: (vRow.stockQuantity || 0) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
                    image: vRow.variantImage || vRow.imageUrl || null,
                    attributes: Object.keys(attrs).length > 0 ? attrs : undefined
                  }
                });
              }

              // Process Images
              let sortOrder = 0;
              for (const imgUrl of uniqueImages) {
                const existing = await prisma.productImage.findFirst({
                  where: { productId: product.id, imageUrl: imgUrl }
                });
                if (!existing) {
                  await prisma.productImage.create({
                    data: {
                      productId: product.id,
                      imageUrl: imgUrl,
                      sortOrder
                    }
                  });
                }
                sortOrder++;
              }

              for (const row of groupRows) {
                await prisma.productImportRow.update({
                  where: { id: row.id },
                  data: { processedAt: new Date(), errorMessage: null }
                });
                successRows += 1;
              }
              
              return product;
            } catch (error) {
              failedRows += groupRows.length;
              for (const row of groupRows) {
                await prisma.productImportRow.update({
                  where: { id: row.id },
                  data: { processedAt: new Date(), errorMessage: error instanceof Error ? error.message : "Unknown error" }
                });
              }
              return null;
            }
          }));
          
          allUpsertedProducts.push(...upsertedChunk.filter(Boolean));
        }

        if (allUpsertedProducts.length > 0) {
          const searchDocs = allUpsertedProducts.map(p => ({
            id: p!.id.toString(),
            sku: p!.sku,
            title: p!.title,
            slug: p!.slug,
            price: Number(p!.basePrice),
            salePrice: p!.salePrice ? Number(p!.salePrice) : null,
            stockStatus: p!.stockStatus,
            categorySlug: p!.category?.slug,
            brandSlug: p!.brand?.slug,
            image: p!.mainImage
          }));
          
          try {
            await syncProductsToSearch(searchDocs);
          } catch (e) {
            console.error("Search sync failed:", e);
          }
        }
      } catch (err) {
        console.error("Bulk process error:", err);
        failedRows += validRows.length;
        
        for (let i = 0; i < validRows.length; i += 50) {
          const chunk = validRows.slice(i, i + 50);
          await Promise.all(chunk.map(row => 
            prisma.productImportRow.update({
              where: { id: row.id },
              data: { processedAt: new Date(), errorMessage: "Batch processing failed" }
            })
          ));
        }
      }
    }

    processed += rows.length;
    await prisma.productImportBatch.update({
      where: { id: batchId },
      data: { successRows, failedRows, message: `Processed ${processed} rows` }
    });
  }

  await prisma.productImportBatch.update({
    where: { id: batchId },
    data: {
      status: failedRows > 0 ? "FAILED" : "COMPLETED",
      successRows,
      failedRows,
      message: `Completed. Success: ${successRows}. Failed: ${failedRows}.`
    }
  });

  return { successRows, failedRows };
}
