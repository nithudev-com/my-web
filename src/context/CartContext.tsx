'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
  title?: string;
  price?: number;
  imageUrl?: string;
};

type CartContextType = {
  items: CartItemInput[];
  isLoaded: boolean;
  isCartOpen: boolean;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  addItem: (productId: string, quantity: number, variantId?: string, title?: string, price?: number, imageUrl?: string, skipOpenCart?: boolean) => void;
  clearCart: () => void;
  syncItems: (items: CartItemInput[]) => void;
  openCart: () => void;
  closeCart: () => void;
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

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

  const setCouponCode = (code: string | null) => {
    setCouponCodeState(code);
    if (code) {
      localStorage.setItem('speed_cart_coupon', code);
    } else {
      localStorage.removeItem('speed_cart_coupon');
    }
  };

  const saveCart = (newItems: CartItemInput[]) => {
    setItems(newItems);
    localStorage.setItem('speed_cart', JSON.stringify(newItems));
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) return;
    const newItems = items.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newItems);
  };

  const removeItem = (productId: string, variantId?: string) => {
    const newItems = items.filter(item => !(item.productId === productId && item.variantId === variantId));
    saveCart(newItems);
  };

  const addItem = (productId: string, quantity: number, variantId?: string, title?: string, price?: number, imageUrl?: string, skipOpenCart?: boolean) => {
    const existingIndex = items.findIndex(item => item.productId === productId && item.variantId === variantId);
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += quantity;
      // Update with latest metadata if provided
      if (title) newItems[existingIndex].title = title;
      if (price !== undefined) newItems[existingIndex].price = price;
      if (imageUrl) newItems[existingIndex].imageUrl = imageUrl;
      saveCart(newItems);
    } else {
      saveCart([...items, { productId, variantId, quantity, title, price, imageUrl }]);
    }
    if (!skipOpenCart) {
      setIsCartOpen(true); // Automatically open the slide-out cart when adding
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{
      items, isLoaded, isCartOpen, updateQuantity, removeItem, addItem, clearCart, syncItems: saveCart, openCart, closeCart, couponCode, setCouponCode
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
