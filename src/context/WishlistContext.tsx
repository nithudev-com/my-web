'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getWishlistProductIds } from '@/app/(frontend)/account/wishlist/actions';

type WishlistState = {
  wishlistIds: Set<string>;
  isLoaded: boolean;
};

type WishlistActions = {
  addOptimisticId: (id: string) => void;
  removeOptimisticId: (id: string) => void;
};

export const WishlistStateContext = createContext<WishlistState | undefined>(undefined);
export const WishlistActionsContext = createContext<WishlistActions | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Instantly load from localStorage for lightning-fast speed!
    try {
      const stored = localStorage.getItem('guest_wishlist');
      if (stored) {
        setWishlistIds(new Set(JSON.parse(stored)));
      }
    } catch (e) {}
    setIsLoaded(true);

    // 2. Non-blocking background sync with server ONLY if authenticated
    if (document.cookie.includes('customer_logged_in=1')) {
      getWishlistProductIds().then((ids) => {
        if (ids && ids.length > 0) {
          setWishlistIds(prev => {
            const newSet = new Set(prev);
            ids.forEach(id => newSet.add(id.toString()));
            localStorage.setItem('guest_wishlist', JSON.stringify([...newSet]));
            return newSet;
          });
        }
      }).catch(() => {});
    }

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
          try {
            localStorage.setItem('guest_wishlist', JSON.stringify([...newSet]));
          } catch(e) {}
          return newSet;
        });
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
  }, []);

  const addOptimisticId = useCallback((id: string) => {
    setWishlistIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  const removeOptimisticId = useCallback((id: string) => {
    setWishlistIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const stateValue = useMemo(() => ({ wishlistIds, isLoaded }), [wishlistIds, isLoaded]);
  const actionsValue = useMemo(() => ({ addOptimisticId, removeOptimisticId }), [addOptimisticId, removeOptimisticId]);

  return (
    <WishlistStateContext.Provider value={stateValue}>
      <WishlistActionsContext.Provider value={actionsValue}>
        {children}
      </WishlistActionsContext.Provider>
    </WishlistStateContext.Provider>
  );
}

export function useWishlistState() {
  const context = useContext(WishlistStateContext);
  if (context === undefined) {
    throw new Error('useWishlistState must be used within a WishlistProvider');
  }
  return context;
}

export function useWishlistActions() {
  const context = useContext(WishlistActionsContext);
  if (context === undefined) {
    throw new Error('useWishlistActions must be used within a WishlistProvider');
  }
  return context;
}
