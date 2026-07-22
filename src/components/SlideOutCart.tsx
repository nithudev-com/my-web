'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { shopifyLoader } from "@/lib/image-loader";
import { useCartState, useCartActions } from '@/context/CartContext';
import { revalidateCartTotals, RevalidatedCart } from '@/app/(frontend)/checkout/cart-actions';
import { FreeShippingBar } from './FreeShippingBar';

export function SlideOutCart() {
  const cartState = useCartState();
  const cartActions = useCartActions();
  const [validatedCart, setValidatedCart] = useState<RevalidatedCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponInput, setCouponInput] = useState(cartState.couponCode || '');

  useEffect(() => {
    setCouponInput(cartState.couponCode || '');
  }, [cartState.couponCode]);

  useEffect(() => {
    if (cartState.isCartOpen && cartState.items.length > 0) {
      setIsLoading(true);
      revalidateCartTotals(cartState.items, undefined, cartState.couponCode || undefined)
        .then((result) => {
          setValidatedCart(result);
          setIsLoading(false);
          
          // Auto-remove invalid items (e.g. products that were deleted or merged)
          if (result.items.length < cartState.items.length) {
             const validItems = cartState.items.filter(clientItem => 
               result.items.some(serverItem => serverItem.productId === clientItem.productId && serverItem.variantId === clientItem.variantId)
             );
             if (validItems.length !== cartState.items.length) {
               cartActions.syncItems(validItems);
             }
          }

          // Auto-remove invalid coupons
          if (result.couponError && cartState.couponCode) {
            cartActions.setCouponCode(null);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [cartState.isCartOpen, cartState.items, cartState.couponCode]);

  if (!cartState.isLoaded) return null;

  return (
    <>
      <div 
        className={`slide-out-cart-overlay ${cartState.isCartOpen ? 'open' : ''}`} 
        onClick={cartActions.closeCart}
      />
      <div className={`slide-out-cart ${cartState.isCartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>Your Cart ({cartState.items.length})</h2>
          <button aria-label="Close Cart" className="cart-drawer-close" onClick={cartActions.closeCart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <FreeShippingBar subtotal={validatedCart?.totals.subtotal || 0} />

        {validatedCart?.error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', margin: '16px 16px 0', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>
            {validatedCart.error}
          </div>
        )}
        {validatedCart?.couponError && (
          <div style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fcd34d', padding: '10px 12px', margin: '16px 16px 0', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {validatedCart.couponError}
          </div>
        )}

        <div className="cart-drawer-items">
          {cartState.items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Your cart is empty.</p>
              <button 
                onClick={cartActions.closeCart} 
                style={{ marginTop: '16px', background: 'none', border: 'none', color: '#D63062', fontWeight: 600, cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartState.items.map((cartItem, idx) => {
              const validatedItem = validatedCart?.items.find(v => v.productId === cartItem.productId && v.variantId === cartItem.variantId);
              const title = validatedItem?.title || cartItem.title || 'Loading...';
              const price = validatedItem?.unitPrice || cartItem.price || 0;
              const imageUrl = validatedItem?.imageUrl || cartItem.imageUrl;
              const variantTitle = validatedItem?.variantTitle;
              const totalPrice = price * cartItem.quantity;

              return (
              <div key={`${cartItem.productId}-${cartItem.variantId || idx}`} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <div style={{ width: '80px', height: '80px', position: 'relative', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  {imageUrl ? (
                    <Image src={imageUrl} alt={title} fill sizes="80px" style={{ objectFit: 'cover' }}  loader={shopifyLoader} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Img</div>
                  )}
                </div>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.3 }}>{title}</div>
                  {variantTitle && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{variantTitle}</div>}
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '4px', padding: '2px 6px' }}>
                      <button aria-label="Decrease quantity" onClick={() => cartActions.updateQuantity(cartItem.productId, cartItem.quantity - 1, cartItem.variantId)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>-</button>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{cartItem.quantity}</span>
                      <button aria-label="Increase quantity" onClick={() => cartActions.updateQuantity(cartItem.productId, cartItem.quantity + 1, cartItem.variantId)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>+</button>
                    </div>
                    <div style={{ fontWeight: 700 }}>${totalPrice.toFixed(2)}</div>
                  </div>
                </div>
                <button 
                  onClick={() => cartActions.removeItem(cartItem.productId, cartItem.variantId)} 
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', alignSelf: 'flex-start' }}
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              );
            })
          )}
        </div>

        {validatedCart && validatedCart.items.length > 0 && (
          <div className="cart-drawer-footer">
            {cartState.couponCode ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', color: '#059669', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
                {validatedCart.couponMessage || `Code applied: ${cartState.couponCode}`}
                <button onClick={() => cartActions.setCouponCode(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '18px', padding: '0 4px' }}>×</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  value={couponInput} 
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Discount code" 
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
                <button 
                  onClick={() => cartActions.setCouponCode(couponInput.trim())}
                  disabled={!couponInput.trim() || isLoading}
                  style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 16px', fontWeight: 600, cursor: 'pointer', opacity: (!couponInput.trim() || isLoading) ? 0.5 : 1 }}
                >
                  Apply
                </button>
              </div>
            )}
            
            <div className="cart-drawer-totals">
              <span>Subtotal</span>
              <span>${validatedCart?.totals.subtotal.toFixed(2) || '0.00'}</span>
            </div>
            
            {validatedCart.totals.discount > 0 && (
              <div className="cart-drawer-totals" style={{ color: '#059669' }}>
                <span>Discount</span>
                <span>-${validatedCart.totals.discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="cart-drawer-totals" style={{ fontWeight: 800, fontSize: '18px', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
              <span>Total</span>
              <span>${(validatedCart.totals.subtotal - validatedCart.totals.discount).toFixed(2)}</span>
            </div>
            
            <Link prefetch={true} href="/checkout" className="cart-drawer-checkout" onClick={cartActions.closeCart} style={{ marginTop: '16px' }}>
              Checkout Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
