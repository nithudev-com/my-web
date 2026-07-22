'use client';

import { useCartState, CartItemInput } from '@/context/CartContext';

export type { CartItemInput };

export function useCart() {
  return useCartState();
}
