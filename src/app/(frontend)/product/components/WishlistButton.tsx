'use client';

import { useState, useEffect, useRef } from 'react';
import { toggleWishlist } from '../../account/wishlist/actions';
import { toast } from 'react-hot-toast';
import { useWishlistContext } from '@/context/WishlistContext';

export function WishlistButton({ productId, mini = false }: { productId: string, mini?: boolean }) {
  const { wishlistIds, addOptimisticId, removeOptimisticId, isLoaded } = useWishlistContext();
  const inWishlist = wishlistIds.has(productId);

  const handleToggle = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // 1. Optimistic Update
    const previousState = inWishlist;
    const newState = !previousState;
    if (newState) {
      addOptimisticId(productId);
    } else {
      removeOptimisticId(productId);
    }
    
    // 2. Optimistic Event Dispatch to Header
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { action: newState ? 'added' : 'removed' } }));

    // 3. Instant Visual Feedback
    if (newState) {
      toast.success('Added to wishlist', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#1e293b',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
          fontWeight: 500,
          fontSize: '15px'
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
      });
    } else {
      toast('Removed from wishlist', {
        duration: 3000,
        position: 'top-center',
        icon: '💔',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#1e293b',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
          fontWeight: 500,
          fontSize: '15px'
        },
      });
    }

    // 4. Server Sync
    const result = await toggleWishlist(BigInt(productId));
    if (!result.success) {
      // Revert if failed
      if (previousState) {
        addOptimisticId(productId);
      } else {
        removeOptimisticId(productId);
      }
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { action: previousState ? 'added' : 'removed' } }));
      
      if (result.error) {
        toast.error(result.error, {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#1e293b',
            backdropFilter: 'blur(10px)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            padding: '16px 20px',
            fontWeight: 500,
            fontSize: '15px'
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        });
      }
    }
  };

  if (mini) {
    return (
      <button
        onClick={handleToggle}
        title="Save to Wishlist"
        className={`wishlist-btn-mini ${inWishlist ? 'active' : ''}`}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          color: inWishlist ? '#ef4444' : '#94a3b8',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggle}
      title="Save to Wishlist"
      style={{
        background: '#FFF4F7',
        border: '1px solid #F0DDE5',
        color: inWishlist ? '#D63062' : '#94a3b8',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: '0.2s'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? '#D63062' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
