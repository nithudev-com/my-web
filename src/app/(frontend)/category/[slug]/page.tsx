import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { categoryJsonLd, siteUrl } from "@/lib/seo";
import { getFilteredProducts } from "@/services/products";
import { ProductFilters } from "@/components/ProductFilters";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { getSitemapCategories } from "@/services/products";

export const revalidate = 1800;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getSitemapCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getFilteredProducts({ slug, page: 1, limit: 1 });

  if (!category) return { title: "Category not found" };

  return {
    title: category.seoTitle || `${category.name} | Shop Online`,
    description: category.seoDescription || `Shop ${category.name} products online.`,
    alternates: { canonical: siteUrl(`/category/${category.slug}`) }
  };
}

async function getCategoryPageData(categoryId: string | bigint, productIdsString: string) {
  return unstable_cache(
    async () => {
      const ids = productIdsString ? productIdsString.split(',').map(BigInt) : [];
      const [subcategories, reviewStats] = await Promise.all([
        prisma.category.findMany({
          where: { parentId: BigInt(categoryId) },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          select: { id: true, name: true, slug: true, image: true }
        }),
        ids.length > 0
          ? prisma.review.groupBy({
              by: ['productId'],
              where: { productId: { in: ids }, approved: true },
              _avg: { rating: true },
              _count: { rating: true },
            })
          : Promise.resolve([]),
      ]);
      const serialize = (obj: any) => JSON.parse(JSON.stringify(obj, (k, v) => typeof v === 'bigint' ? v.toString() : v));
      return serialize({ subcategories, reviewStats });
    },
    [`category-page-data-${categoryId.toString()}-${productIdsString}`],
    { revalidate: 1800, tags: [`category:${categoryId.toString()}`, 'reviews'] }
  )();
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string, minPrice?: string, maxPrice?: string, sort?: string, brand?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;

  const page = Number(query.page || 1);
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  const sort = query.sort;
  const brand = query.brand;

  const { category, products, total } = await getFilteredProducts({ slug, page, limit: 24, minPrice, maxPrice, sort, brandSlug: brand });

  if (!category) notFound();

  const productIds = (products || []).map((p) => BigInt(p.id.toString()));


  const { subcategories, reviewStats } = await getCategoryPageData(category.id, productIds.join(','));

  const reviewMap = new Map<string, any>(
    reviewStats.map((r: any) => [
      r.productId.toString(),
      { avg: Number(r._avg?.rating ?? 0), count: r._count?.rating ?? 0 },
    ])
  );

  return (
    <main className="container">
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd(category)) }} />
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>{category.name}</h1>
        <p className="muted">{total} products found.</p>
      </div>

      {subcategories.length > 0 && (
        <div className="category-showcase-grid">
          {subcategories.map((subcat: any) => (
            <Link key={subcat.id.toString()} href={`/category/${subcat.slug}`} className="category-showcase-item">
              <div className="category-showcase-image-wrapper">
                {subcat.image ? (
                  <img src={subcat.image} alt={subcat.name} className="category-showcase-image" />
                ) : (
                  <span style={{ fontSize: '24px', color: '#94a3b8' }}>{subcat.name.charAt(0)}</span>
                )}
              </div>
              <span className="category-showcase-title">{subcat.name}</span>
            </Link>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <ProductFilters />

        {/* Right Product Grid */}
        <div style={{ flexGrow: 1 }}>
          {products.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111111' }}>No products found</h3>
              <p style={{ color: '#64748b' }}>Try adjusting your filters or price range to see more results.</p>
            </div>
          ) : (
            <div className="grid">
              {(products || []).map((product) => {
                const id = product.id.toString();
                const stats = reviewMap.get(id);
                return (
                  <ProductCard
                    key={id}
                    id={id}
                    title={product.title}
                    slug={product.slug}
                    image={product.mainImage || (product as any).images?.[0]?.imageUrl || ""}
                    price={product.basePrice.toString()}
                    salePrice={product.salePrice?.toString()}
                    category={product.category?.name}
                    brand={product.brand?.name}
                    variantsCount={(product as any)._count?.variants || 0}
                    avgRating={stats?.avg ?? 0}
                    reviewCount={stats?.count ?? 0}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
