import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { siteUrl } from "@/lib/seo";
import { getFilteredProducts } from "@/services/products";

export const revalidate = 1800;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { brand } = await getFilteredProducts({ brandSlug: slug, page: 1, limit: 1 });

    if (!brand) return { title: "Brand not found" };

    return {
      title: brand.seoTitle || `${brand.name} | Official Products`,
      description: brand.seoDescription || `Shop all official ${brand.name} products.`,
      alternates: { canonical: siteUrl(`/brand/${brand.slug}`) }
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return { title: "Brand" };
  }
}

export default async function BrandPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string, minPrice?: string, maxPrice?: string, sort?: string }> }) {
  try {
    const { slug } = await params;
  const query = await searchParams;
  
  const page = Number(query.page || 1);
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  const sort = query.sort;

  const { brand, products, total } = await getFilteredProducts({ brandSlug: slug, page, limit: 24, minPrice, maxPrice, sort });

  if (!brand) notFound();

  return (
    <main>
      {/* Ultra-Premium Split-Pane Brand Header */}
      <section className="brand-split-hero">
        <div className="container brand-split-container">
          {/* Left Side: Brand Info */}
          <div className="brand-split-left">
            <h1 className="brand-split-title">{brand.name}</h1>
            <div className="brand-split-subtitle">Official Flagship Store</div>
            <div className="brand-split-stats">
              <span className="brand-stat-glass">{total} Premium Products</span>
            </div>
          </div>
          
          {/* Right Side: Levitating Logo Card */}
          <div className="brand-split-right">
            {brand.logo && (
              <div className="brand-glass-card">
                <img src={brand.logo} alt={`${brand.name} logo`} />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="brand-page-layout">
          {/* Main Product Grid (Full Width) */}
          <div className="brand-content">
            {products.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111111' }}>No products found</h3>
                <p style={{ color: '#64748b' }}>This brand hasn't listed any products yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid">
                {(products || []).map((product) => (
                  <ProductCard
                    variantsCount={(product as any)._count?.variants || 0}
                    key={product.id.toString()}
                    id={product.id.toString()}
                    title={product.title}
                    slug={product.slug}
                    image={product.mainImage}
                    price={product.basePrice.toString()}
                    salePrice={product.salePrice?.toString()}
                    category={product.category?.name}
                    brand={product.brand?.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
  } catch (error: any) {
    return <div style={{padding: '50px', background: 'red', color: 'white'}}><pre>{error?.message || String(error)}</pre><pre>{error?.stack}</pre></div>;
  }
}
