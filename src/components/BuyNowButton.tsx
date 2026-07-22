'use client';

import React from 'react';
import { useCartActions } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export function BuyNowButton({ productId, variantId, outOfStock }: { productId: string, variantId?: string, outOfStock?: boolean }) {
  const cartActions = useCartActions();
  const router = useRouter();

  const handleBuyNow = () => {
    cartActions.addItem(productId, 1, variantId, undefined, undefined, undefined, true);
    // Push the user directly to the checkout page instead of waiting in the drawer
    router.push('/checkout');
  };

  if (outOfStock) {
    return null; // The AddToCart button already shows the 'Out of Stock' state
  }

  return (
    <button 
      className="button" 
      style={{ flex: 1, background: '#111111', color: '#ffffff', border: 'none', transition: 'background 0.2s' }} 
      onClick={handleBuyNow}
      onMouseOver={(e) => e.currentTarget.style.background = '#334155'}
      onMouseOut={(e) => e.currentTarget.style.background = '#111111'}
    >
      Buy Now
    </button>
  );
}
