'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type CartItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
  title?: string;
  price?: number;
  imageUrl?: string;
};

type CartState = {
  items: CartItemInput[];
  isLoaded: boolean;
  isCartOpen: boolean;
  couponCode: string | null;
};

type CartActions = {
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  addItem: (productId: string, quantity: number, variantId?: string, title?: string, price?: number, imageUrl?: string, skipOpenCart?: boolean) => void;
  clearCart: () => void;
  syncItems: (items: CartItemInput[]) => void;
  openCart: () => void;
  closeCart: () => void;
  setCouponCode: (code: string | null) => void;
};

export const CartStateContext = createContext<CartState | undefined>(undefined);
export const CartActionsContext = createContext<CartActions | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemInput[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCodeState] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('speed_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem('speed_cart_coupon');
      if (storedCoupon) {
        setCouponCodeState(storedCoupon);
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
    setIsLoaded(true);
  }, []);

  const setCouponCode = useCallback((code: string | null) => {
    setCouponCodeState(code);
    if (code) {
      localStorage.setItem('speed_cart_coupon', code);
    } else {
      localStorage.removeItem('speed_cart_coupon');
    }
  }, []);

  const saveCart = useCallback((newItems: CartItemInput[]) => {
    setItems(newItems);
    localStorage.setItem('speed_cart', JSON.stringify(newItems));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) return;
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      });
      localStorage.setItem('speed_cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => !(item.productId === productId && item.variantId === variantId));
      localStorage.setItem('speed_cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const addItem = useCallback((productId: string, quantity: number, variantId?: string, title?: string, price?: number, imageUrl?: string, skipOpenCart?: boolean) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const existingIndex = newItems.findIndex(item => item.productId === productId && item.variantId === variantId);
      if (existingIndex >= 0) {
        newItems[existingIndex].quantity += quantity;
        if (title) newItems[existingIndex].title = title;
        if (price !== undefined) newItems[existingIndex].price = price;
        if (imageUrl) newItems[existingIndex].imageUrl = imageUrl;
      } else {
        newItems.push({ productId, variantId, quantity, title, price, imageUrl });
      }
      localStorage.setItem('speed_cart', JSON.stringify(newItems));
      return newItems;
    });
    if (!skipOpenCart) {
      setIsCartOpen(true);
    }
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const stateValue = useMemo(() => ({ items, isLoaded, isCartOpen, couponCode }), [items, isLoaded, isCartOpen, couponCode]);
  const actionsValue = useMemo(() => ({ updateQuantity, removeItem, addItem, clearCart, syncItems: saveCart, openCart, closeCart, setCouponCode }), [updateQuantity, removeItem, addItem, clearCart, saveCart, openCart, closeCart, setCouponCode]);

  return (
    <CartStateContext.Provider value={stateValue}>
      <CartActionsContext.Provider value={actionsValue}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCartState() {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context;
}

export function useCartActions() {
  const context = useContext(CartActionsContext);
  if (context === undefined) {
    throw new Error('useCartActions must be used within a CartProvider');
  }
  return context;
}
