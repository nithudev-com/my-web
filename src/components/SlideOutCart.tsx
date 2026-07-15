'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartContext } from '@/context/CartContext';
import { revalidateCartTotals, RevalidatedCart } from '@/app/(frontend)/checkout/cart-actions';
import { FreeShippingBar } from './FreeShippingBar';

export function SlideOutCart() {
  const cart = useCartContext();
  const [validatedCart, setValidatedCart] = useState<RevalidatedCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cart.isCartOpen && cart.items.length > 0) {
      setIsLoading(true);
      revalidateCartTotals(cart.items)
        .then((result) => {
          setValidatedCart(result);
          setIsLoading(false);
          
          // Auto-remove invalid items (e.g. products that were deleted or merged)
          if (result.items.length < cart.items.length) {
             const validItems = cart.items.filter(clientItem => 
               result.items.some(serverItem => serverItem.productId === clientItem.productId && serverItem.variantId === clientItem.variantId)
             );
             if (validItems.length !== cart.items.length) {
               cart.syncItems(validItems);
             }
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [cart.isCartOpen, cart.items]);

  if (!cart.isLoaded) return null;

  return (
    <>
      <div 
        className={`slide-out-cart-overlay ${cart.isCartOpen ? 'open' : ''}`} 
        onClick={cart.closeCart}
      />
      <div className={`slide-out-cart ${cart.isCartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>Your Cart ({cart.items.length})</h2>
          <button aria-label="Close Cart" className="cart-drawer-close" onClick={cart.closeCart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <FreeShippingBar subtotal={validatedCart?.totals.subtotal || 0} />

        {validatedCart?.error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', margin: '16px 16px 0', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>
            {validatedCart.error}
          </div>
        )}

        <div className="cart-drawer-items">
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Your cart is empty.</p>
              <button 
                onClick={cart.closeCart} 
                style={{ marginTop: '16px', background: 'none', border: 'none', color: '#D63062', fontWeight: 600, cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : isLoading && !validatedCart ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading items...</div>
          ) : (
            validatedCart?.items.map((item, idx) => (
              <div key={`${item.productId}-${item.variantId || idx}`} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <div style={{ width: '80px', height: '80px', position: 'relative', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Img</div>
                  )}
                </div>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.3 }}>{item.title}</div>
                  {item.variantTitle && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{item.variantTitle}</div>}
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '4px', padding: '2px 6px' }}>
                      <button aria-label="Decrease quantity" onClick={() => cart.updateQuantity(item.productId, item.quantity - 1, item.variantId)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>-</button>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.quantity}</span>
                      <button aria-label="Increase quantity" onClick={() => cart.updateQuantity(item.productId, item.quantity + 1, item.variantId)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>+</button>
                    </div>
                    <div style={{ fontWeight: 700 }}>${item.totalPrice.toFixed(2)}</div>
                  </div>
                </div>
                <button 
                  onClick={() => cart.removeItem(item.productId, item.variantId)} 
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', alignSelf: 'flex-start' }}
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {validatedCart && validatedCart.items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-totals">
              <span>Subtotal</span>
              <span>${validatedCart?.totals.subtotal.toFixed(2) || '0.00'}</span>
            </div>
            <Link href="/checkout" className="cart-drawer-checkout" onClick={cart.closeCart}>
              Secure Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
