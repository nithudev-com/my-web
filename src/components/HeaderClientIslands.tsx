'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { MegaMenu } from './MegaMenu';
import { AutocompleteSearch } from './AutocompleteSearch';

export function HeaderAuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('customer_logged_in=1'));
  }, []);
  
  return (
    <Link prefetch={true} href={isLoggedIn ? "/account" : "/login"} className="header-action-item">
      <div className="header-action-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>
      <span>{isLoggedIn ? 'Account' : 'Sign In'}</span>
    </Link>
  );
}

export function HeaderWishlistButton() {
  const { wishlistIds } = useWishlistContext();
  const wishlistCount = wishlistIds.size;
  return (
    <Link prefetch={true} href="/account/wishlist" className="header-action-item">
      <div className="header-action-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        {wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
      </div>
      <span>Wishlist</span>
    </Link>
  );
}

export function HeaderCartButton() {
  const cart = useCartContext();
  const totalCartItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <button aria-label="Open Cart" onClick={cart.openCart} className="header-action-item" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit' }}>
      <div className="header-action-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        {cart.isLoaded && totalCartItems > 0 && <span className="header-badge">{totalCartItems}</span>}
      </div>
      <span>Cart</span>
    </button>
  );
}

export function DesktopBottomNav({ categories }: { categories: any[] }) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  return (
    <nav className="bottom-nav-bar" style={{ position: 'relative' }}>
      <button aria-label="Toggle All Categories Menu" className="all-categories-btn" onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        All Departments
      </button>
      <div className="bottom-nav-links">
        <Link prefetch={true} href="/deals">Today's Deals</Link>
        <Link prefetch={true} href="/new-releases">New Releases</Link>
        <Link prefetch={true} href="/brand">Brands</Link>
        <Link prefetch={true} href="/category">Categories</Link>
        <Link prefetch={true} href="/blog">Blog</Link>
        <Link prefetch={true} href="/contact">Customer Service</Link>
      </div>
      <MegaMenu 
        categories={categories} 
        isOpen={isMegaMenuOpen} 
        onClose={() => setIsMegaMenuOpen(false)} 
      />
    </nav>
  );
}

export function MobileHeaderWrapper({ settings, categories }: { settings: any, categories: any[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cart = useCartContext();
  const totalCartItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('customer_logged_in=1'));
  }, []);

  return (
    <>
      <header className="mobile-header mobile-header-wrapper">
        <div className="mobile-header-top">
          <button aria-label="Open Mobile Menu" className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <Link prefetch={true} href="/" className="mobile-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo-new.png" alt={settings.storeName || "SexToys Lovers"} style={{ maxHeight: '36px', width: 'auto' }} />
          </Link>

          <button aria-label="Open Cart" onClick={cart.openCart} className="header-action-item" style={{ gap: '0', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <div className="header-action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              {cart.isLoaded && totalCartItems > 0 && <span className="header-badge" style={{ right: '-6px' }}>{totalCartItems}</span>}
            </div>
          </button>
        </div>

        <AutocompleteSearch isMobile={true} categories={categories} />
      </header>

      {/* --- MOBILE DRAWER (SIDEBAR) --- */}
      <div 
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#D63062', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>Hello, {isLoggedIn ? 'Customer' : 'Guest'}</div>
              {isLoggedIn ? (
                <Link prefetch={true} href="/account" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '13px', color: '#D63062', textDecoration: 'none', fontWeight: 600 }}>My Account</Link>
              ) : (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Link prefetch={true} href="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '13px', color: '#D63062', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
                  <span style={{ fontSize: '13px', color: '#cbd5e1' }}>|</span>
                  <Link prefetch={true} href="/register" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '13px', color: '#D63062', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
          <button aria-label="Close Mobile Menu" className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="mobile-drawer-body">
          <Link prefetch={true} href="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Home</Link>
          <Link prefetch={true} href="/deals" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Today's Deals</Link>
          <Link prefetch={true} href="/new-releases" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">New Releases</Link>
          <Link prefetch={true} href="/brand" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">All Brands</Link>
          
          <div className="mobile-drawer-divider"></div>
          <div className="mobile-drawer-title">Shop by Category</div>
          
          <div className="mobile-drawer-categories">
            {categories.map((c) => (
              <Link 
                prefetch={true}
                key={c.id} 
                href={`/category/${c.slug}`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="mobile-drawer-divider"></div>
          <Link prefetch={true} href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Blog</Link>
          <Link prefetch={true} href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Customer Service</Link>
          <Link prefetch={true} href="/returns" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">Returns Policy</Link>
        </div>
      </div>
    </>
  );
}
