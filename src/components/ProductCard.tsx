import Image from "next/image";
import { formatPrice } from "@/lib/money";
import { WishlistButton } from "@/app/(frontend)/product/components/WishlistButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { prisma } from "@/lib/prisma";

type ProductCardProps = {
  id?: string;
  title: string;
  slug: string;
  image?: string | null;
  price: number | string;
  salePrice?: number | string | null;
  category?: string | null;
  brand?: string | null;
  variantsCount?: number;
};

export async function ProductCard({ id, title, slug, image, price, salePrice, category, brand, variantsCount = 0 }: ProductCardProps) {
  let avgRating = 0;
  let reviewCount = 0;

  if (id) {
    const stats = await prisma.review.aggregate({
      where: { productId: BigInt(id), approved: true },
      _avg: { rating: true },
      _count: { rating: true }
    });
    
    reviewCount = stats._count.rating;
    avgRating = stats._avg.rating ? Number(stats._avg.rating) : 0;
  }

  return (
    <div className="premium-product-card" style={{ 
      background: '#ffffff', 
      borderRadius: '16px', 
      border: '1px solid #f1f5f9', 
      overflow: 'hidden', 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .premium-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
        }
        .premium-card-image-link {
          display: block;
          position: relative;
          aspect-ratio: 4 / 4;
          background: #f8fafc; /* Very light gray */
          overflow: hidden;
        }
        .premium-card-image-link img {
          object-fit: contain;
          padding: 0;
        }
        .premium-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .premium-card-brand {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 10px;
          padding-bottom: 10px;
          font-weight: 900;
          text-align: center;
          background: linear-gradient(135deg, #FF0080, #7928CA, #4A00E0, #D63062);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: brandGradientText 4s ease infinite;
          position: relative;
        }
        .premium-card-brand::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 1px;
          background-color: #e2e8f0;
        }
        .premium-card-title {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin: 0 0 12px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .premium-card-title { font-size: 12px; margin-bottom: 8px; }
          .premium-card-price { font-size: 14px !important; }
          .premium-card-old-price { font-size: 11px; display: block; margin-left: 0; margin-top: 2px; }
          .premium-card-body { padding: 8px; }
          .premium-card-price-row { align-items: flex-end; }
        }
        .premium-card-price-row {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .premium-card-price {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a; /* Strong black price */
        }
        .premium-card-old-price {
          font-size: 13px;
          color: #94a3b8;
          text-decoration: line-through;
          margin-left: 6px;
          font-weight: 500;
        }
        .premium-wishlist-pos {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
        }
      `}} />
      
      {id && (
        <div className="premium-wishlist-pos">
          <WishlistButton productId={id} mini={true} />
        </div>
      )}

      <a className="premium-card-image-link" href={`/product/${slug}`}>
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>No Image</div>
        )}
      </a>
      
      <a className="premium-card-body" href={`/product/${slug}`} style={{ textDecoration: 'none' }}>
        {brand && (
          <div className="premium-card-brand">
            {brand}
          </div>
        )}
        <h3 className="premium-card-title">{title}</h3>
        
        {/* Ratings dynamic as per requirements */}
        {reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', color: '#FBBF24', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="12" height="12" fill={star <= Math.round(avgRating) ? 'currentColor' : '#e2e8f0'} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{avgRating.toFixed(1)} ({reviewCount})</span>
          </div>
        )}

        <div className="premium-card-price-row">
          <div>
            <span className="premium-card-price">{await formatPrice(salePrice || price)}</span>
            {salePrice && (
              <span className="premium-card-old-price">{await formatPrice(price)}</span>
            )}
          </div>
          {id && (
            <div style={{ pointerEvents: 'auto' }}>
              {variantsCount > 0 ? (
                <a 
                  href={`/product/${slug}`}
                  title="Select Options"
                  style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </a>
              ) : (
                <AddToCartButton productId={id} outOfStock={false} mini={true} />
              )}
            </div>
          )}
        </div>
      </a>
    </div>
  );
}
