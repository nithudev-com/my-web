import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 60; // ISR for performance

export default async function NewReleasesPage() {
  let latestProducts: any[] = [];
  if (process.env.DATABASE_URL) {
    try {
      latestProducts = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { brand: true, category: true }
      });
    } catch {
      latestProducts = [];
    }
  }

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', paddingBottom: '80px', color: '#fff', overflowX: 'hidden' }}>
      

      <div className="hero-gradient">
        {/* Decorative Floating Elements */}
        <div className="floating-shape" style={{ width: '400px', height: '400px', top: '-100px', left: '-150px', animationDelay: '0s' }}></div>
        <div className="floating-shape" style={{ width: '250px', height: '250px', bottom: '40px', right: '5%', animationDelay: '1.5s' }}></div>
        <div className="floating-shape" style={{ width: '120px', height: '120px', top: '80px', right: '30%', animationDelay: '3s' }}></div>
        
        <h1 className="hero-title">Fresh Drops</h1>
        <p className="hero-subtitle">The absolute latest arrivals.</p>
      </div>

      <div className="container" style={{ marginTop: '-100px', position: 'relative', zIndex: 10 }}>
        <div className="new-releases-grid">
          {latestProducts.map((product, index) => (
            <div key={product.id.toString()} className="animated-card" style={{ animationDelay: `${0.2 + (index * 0.08)}s` }}>
              <ProductCard
                    variantsCount={(product as any)._count?.variants || 0}
                id={product.id.toString()}
                title={product.title}
                slug={product.slug}
                image={product.mainImage}
                price={Number(product.basePrice)}
                salePrice={product.salePrice ? Number(product.salePrice) : null}
                category={product.category?.name}
                brand={product.brand?.name}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
