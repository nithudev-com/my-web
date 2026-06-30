'use client';

import { useCartContext, CartItemInput } from '@/context/CartContext';

export type { CartItemInput };

export function useCart() {
  return useCartContext();
}
