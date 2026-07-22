'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import dynamic from 'next/dynamic';
import { AutocompleteSearch } from './AutocompleteSearch';

const MegaMenu = dynamic(() => import('./MegaMenu').then(mod => mod.MegaMenu), { ssr: false });
const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer').then(mod => mod.MobileMenuDrawer), { ssr: false });

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

export function DesktopMegaMenuTrigger({ categories }: { categories: any[] }) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  return (
    <>
      <button aria-label="Toggle All Categories Menu" className="all-categories-btn" onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        All Departments
      </button>
      {isMegaMenuOpen && (
        <MegaMenu 
          categories={categories} 
          isOpen={isMegaMenuOpen} 
          onClose={() => setIsMegaMenuOpen(false)} 
        />
      )}
    </>
  );
}

export function MobileMenuTrigger({ categories }: { categories: any[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('customer_logged_in=1'));
  }, []);

  return (
    <>
      <button aria-label="Open Mobile Menu" className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>

      {isMobileMenuOpen && (
        <MobileMenuDrawer 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          isLoggedIn={isLoggedIn} 
          categories={categories} 
        />
      )}
    </>
  );
}
