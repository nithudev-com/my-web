'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlistProductIds } from '@/app/(frontend)/account/wishlist/actions';

type WishlistContextType = {
  wishlistIds: Set<string>;
  addOptimisticId: (id: string) => void;
  removeOptimisticId: (id: string) => void;
  isLoaded: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Disabled server fetch per user request for "lightning fast" speed
    setIsLoaded(true);

    const handleWishlistUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.productId && customEvent.detail.action) {
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          if (customEvent.detail.action === 'added') {
            newSet.add(customEvent.detail.productId);
          } else {
            newSet.delete(customEvent.detail.productId);
          }
          return newSet;
        });
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
  }, []);

  const addOptimisticId = (id: string) => {
    setWishlistIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const removeOptimisticId = (id: string) => {
    setWishlistIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, addOptimisticId, removeOptimisticId, isLoaded }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
}
