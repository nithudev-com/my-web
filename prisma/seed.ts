import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

function slug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "demo-category" },
    update: {},
    create: {
      name: "Demo Category",
      slug: "demo-category",
      seoTitle: "Demo Category | Ecommerce Store",
      seoDescription: "Browse fast static ecommerce demo products."
    }
  });

  const brand = await prisma.brand.upsert({
    where: { slug: "demo-brand" },
    update: {},
    create: {
      name: "Demo Brand",
      slug: "demo-brand"
    }
  });

  for (let i = 1; i <= 12; i++) {
    const title = `Demo Product ${i}`;
    const productSlug = slug(title);
    await prisma.product.upsert({
      where: { sku: `DEMO-${i}` },
      update: {},
      create: {
        sku: `DEMO-${i}`,
        title,
        slug: productSlug,
        shortDescription: "Fast ISR ecommerce product page example.",
        description: "This product is seeded for testing product pages, category pages, sitemap, and importer flow.",
        basePrice: 999 + i,
        salePrice: i % 2 === 0 ? 899 + i : null,
        stockQuantity: 100,
        categoryId: category.id,
        brandId: brand.id,
        mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        seoTitle: `${title} | Buy Online`,
        seoDescription: `Buy ${title} online with fast delivery.`
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
