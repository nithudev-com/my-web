import { ProductCard } from "@/components/ProductCard";
import { getHomeProducts } from "@/services/products";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { BrandMarquee } from "@/components/BrandMarquee";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CategoryCircles } from "@/components/CategoryCircles";

export const revalidate = 900;

const getHomePageData = unstable_cache(
  async (productIdsString: string) => {
    const ids = productIdsString ? productIdsString.split(',').map(BigInt) : [];
    
    const reviewStats = ids.length > 0
      ? await prisma.review.groupBy({
          by: ["productId"],
          where: { productId: { in: ids }, approved: true },
          _avg: { rating: true },
          _count: { rating: true },
        })
      : [];

    const [brands, categories, circles] = await Promise.all([
      prisma.brand.findMany({
        where: { showOnHome: true },
        select: { id: true, name: true, slug: true, logo: true },
        orderBy: { name: "asc" },
        take: 20,
      }),
      prisma.category.findMany({
        where: { showOnHome: true },
        select: { id: true, name: true, slug: true, image: true, seoTitle: true },
        take: 16,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.categoryCircle.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    const serialize = (obj: any) => JSON.parse(JSON.stringify(obj, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    
    return serialize({ reviewStats, brands, categories, circles });
  },
  ['home-page-data'],
  { revalidate: 900, tags: ['home-data'] }
);

export default async function HomePage() {
  const products = await getHomeProducts();

  // --- ONE batched query for all review stats (replaces N+1 per-card DB calls) ---
  const productIds = (products || [])
    .map((p) => BigInt(p.id.toString()))
    .filter(Boolean);

  const productIdsString = productIds.join(',');
  const { reviewStats, brands, categories, circles } = await getHomePageData(productIdsString);

  const serializedBrands = brands.map((b: any) => ({ ...b, id: b.id.toString() }));
  const serializedCategories = categories.map((c: any) => ({ ...c, id: c.id.toString() }));
  const serializedCircles = circles.map((c: any) => ({ ...c, id: c.id.toString() }));

  const reviewMap = new Map<string, any>(
    reviewStats.map((r: any) => [
      r.productId.toString(),
      { avg: Number(r._avg.rating ?? 0), count: r._count.rating },
    ])
  );

  return (
    <main>
      <BrandMarquee brands={serializedBrands} />
      <HeroBanner />
      <CategoryCircles items={serializedCircles} />

      <CategoryGrid categories={serializedCategories} />

      <div className="container">
        <h2>Latest Products</h2>
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
      </div>
    </main>
  );
}
