'use client';

import React from 'react';
import { useCartActions } from '@/context/CartContext';

export function AddToCartButton({ productId, variantId, outOfStock, mini = false, title, price, imageUrl }: { productId: string, variantId?: string, outOfStock?: boolean, mini?: boolean, title?: string, price?: number, imageUrl?: string }) {
  const cartActions = useCartActions();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartActions.addItem(productId, 1, variantId, title, price, imageUrl);
  };

  if (mini) {
    if (outOfStock) {
      return (
        <button className="button-mini out-of-stock" disabled title="Out of Stock" style={{ background: '#f1f5f9', color: '#94a3b8', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      );
    }
    return (
      <button className="button-mini" onClick={handleAddToCart} title="Add to Cart" style={{ background: '#0f172a', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
      </button>
    );
  }

  if (outOfStock) {
    return (
      <button className="button" style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed' }} disabled>
        Out of Stock
      </button>
    );
  }

  return (
    <button className="button" style={{ flex: 1 }} onClick={handleAddToCart}>
      Add to cart
    </button>
  );
}
