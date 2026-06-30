import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Brands | Premium Partners",
  description: "Discover our curated collection of premium brands and partners. Shop the best products from the world's leading manufacturers.",
  alternates: {
    canonical: siteUrl("/brand"),
  },
};

export default async function BrandIndexPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: { where: { status: 'ACTIVE' } } }
      }
    }
  });

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      
      {/* MASSIVE HERO SECTION */}
      <section className="brand-index-hero">
        <div className="brand-index-hero-content">
          <h1 className="brand-index-title">Our Partners</h1>
          <p className="brand-index-subtitle">
            Discover a curated collection of the world's most premium brands, engineered for excellence and uncompromising quality.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        
        {brands.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '24px', color: '#64748b' }}>No brands available.</h2>
          </div>
        ) : (
          <div className="brand-index-grid">
            {brands.map((brand) => (
              <Link key={brand.id.toString()} href={`/brand/${brand.slug}`} className="brand-index-card">
                <div className="brand-index-card-inner">
                  
                  {/* Avatar / Logo Area */}
                  <div className="brand-index-avatar-wrapper">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="brand-index-logo" />
                    ) : (
                      <div className="brand-index-placeholder" style={{ background: `linear-gradient(135deg, hsl(${brand.name.charCodeAt(0) * 10 % 360}, 80%, 60%), hsl(${brand.name.charCodeAt(brand.name.length - 1) * 20 % 360}, 80%, 40%))` }}>
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info Area */}
                  <div className="brand-index-info">
                    <h2 className="brand-index-name">{brand.name}</h2>
                    <span className="brand-index-count">
                      {brand._count.products} {brand._count.products === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
