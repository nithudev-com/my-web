import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getHomeProducts } from "@/services/products";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { BrandMarquee } from "@/components/BrandMarquee";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CategoryCircles } from "@/components/CategoryCircles";

export const revalidate = 900;

const getFeaturedBrands = unstable_cache(
  async () => {
    if (!process.env.DATABASE_URL) return [];
    try {
      const brands = await prisma.brand.findMany({
        where: { showOnHome: true },
        select: { id: true, name: true, slug: true, logo: true },
        orderBy: { name: "asc" },
        take: 20,
      });
      return JSON.parse(JSON.stringify(brands, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    } catch {
      return [];
    }
  },
  ['home-featured-brands'],
  { revalidate: 900, tags: ['home-data', 'brand-slug'] }
);

const getFeaturedCategories = unstable_cache(
  async () => {
    if (!process.env.DATABASE_URL) return [];
    try {
      const categories = await prisma.category.findMany({
        where: { showOnHome: true },
        select: { id: true, name: true, slug: true, image: true, seoTitle: true },
        take: 16,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
      return JSON.parse(JSON.stringify(categories, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    } catch {
      return [];
    }
  },
  ['home-featured-categories'],
  { revalidate: 900, tags: ['home-data', 'category-slug'] }
);

const getCategoryCircles = unstable_cache(
  async () => {
    if (!process.env.DATABASE_URL) return [];
    try {
      const circles = await prisma.categoryCircle.findMany({ orderBy: { sortOrder: "asc" } });
      return JSON.parse(JSON.stringify(circles, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    } catch {
      return [];
    }
  },
  ['home-category-circles'],
  { revalidate: 900, tags: ['home-data', 'category-slug'] }
);

const getReviewStats = async (productIdsString: string) => {
  return unstable_cache(
    async () => {
      const ids = productIdsString ? productIdsString.split(',').map(BigInt) : [];
      if (ids.length === 0) return [];
      
      if (!process.env.DATABASE_URL) return [];
      try {
        const stats = await prisma.review.groupBy({
          by: ["productId"],
          where: { productId: { in: ids }, approved: true },
          _avg: { rating: true },
          _count: { rating: true },
        });
        return JSON.parse(JSON.stringify(stats, (k, v) => typeof v === 'bigint' ? v.toString() : v));
      } catch {
        return [];
      }
    },
    [`home-review-stats-${productIdsString}`],
    { revalidate: 900, tags: ['home-data', 'products'] }
  )();
};

async function BelowTheFoldContent({ productsPromise, reviewStatsPromise, categoriesPromise }: { productsPromise: Promise<any>, reviewStatsPromise: Promise<any>, categoriesPromise: Promise<any> }) {
  const [products, reviewStats, categories] = await Promise.all([productsPromise, reviewStatsPromise, categoriesPromise]);
  
  const reviewMap = new Map<string, any>(
    reviewStats.map((r: any) => [
      r.productId.toString(),
      { avg: Number(r._avg.rating ?? 0), count: r._count.rating },
    ])
  );

  return (
    <>
      <CategoryGrid categories={categories} />
      <div className="container">
        <h2>Latest Products</h2>
        <div className="grid">
          {(products || []).map((product: any) => {
            const id = product.id.toString();
            const stats = reviewMap.get(id);
            return (
              <ProductCard
                key={id}
                id={id}
                title={product.title}
                slug={product.slug}
                image={product.mainImage || product.images?.[0]?.imageUrl || ""}
                price={product.basePrice.toString()}
                salePrice={product.salePrice?.toString()}
                category={product.category?.name}
                brand={product.brand?.name}
                variantsCount={product._count?.variants || 0}
                avgRating={stats?.avg ?? 0}
                reviewCount={stats?.count ?? 0}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default async function HomePage() {
  const productsPromise = getHomeProducts();
  const brandsPromise = getFeaturedBrands();
  const categoriesPromise = getFeaturedCategories();
  const circlesPromise = getCategoryCircles();

  const products = await productsPromise;
  
  const productIds = (products || [])
    .map((p: any) => p.id.toString())
    .filter(Boolean);
  
  const productIdsString = productIds.join(',');
  const reviewsPromise = getReviewStats(productIdsString);

  // We await only what's needed for the above-the-fold content here
  const [brands, circles] = await Promise.all([brandsPromise, circlesPromise]);

  return (
    <main>
      <BrandMarquee brands={brands} />
      <HeroBanner />
      <CategoryCircles items={circles} />

      <Suspense fallback={<div className="container" style={{ padding: "40px 0", textAlign: "center", color: "#64748b" }}>Loading latest products and categories...</div>}>
        <BelowTheFoldContent 
          productsPromise={Promise.resolve(products)} 
          reviewStatsPromise={reviewsPromise} 
          categoriesPromise={categoriesPromise} 
        />
      </Suspense>
    </main>
  );
}
