'use client';

import React from 'react';
import Link from 'next/link';

export function MobileMenuDrawer({ 
  isOpen, 
  onClose, 
  isLoggedIn, 
  categories 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  isLoggedIn: boolean, 
  categories: any[] 
}) {
  return (
    <>
      <div 
        className={`mobile-drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>
      
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#D63062', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>Hello, {isLoggedIn ? 'Customer' : 'Guest'}</div>
              {isLoggedIn ? (
                <Link prefetch={true} href="/account" onClick={onClose} style={{ fontSize: '13px', color: '#D63062', textDecoration: 'none', fontWeight: 600 }}>My Account</Link>
              ) : (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Link prefetch={true} href="/login" onClick={onClose} style={{ fontSize: '13px', color: '#D63062', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
                  <span style={{ fontSize: '13px', color: '#cbd5e1' }}>|</span>
                  <Link prefetch={true} href="/register" onClick={onClose} style={{ fontSize: '13px', color: '#D63062', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
          <button aria-label="Close Mobile Menu" className="mobile-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="mobile-drawer-body">
          <Link prefetch={true} href="/" onClick={onClose} className="mobile-drawer-link">Home</Link>
          <Link prefetch={true} href="/deals" onClick={onClose} className="mobile-drawer-link">Today's Deals</Link>
          <Link prefetch={true} href="/new-releases" onClick={onClose} className="mobile-drawer-link">New Releases</Link>
          <Link prefetch={true} href="/brand" onClick={onClose} className="mobile-drawer-link">All Brands</Link>
          
          <div className="mobile-drawer-divider"></div>
          <div className="mobile-drawer-title">Shop by Category</div>
          
          <div className="mobile-drawer-categories">
            {categories.map((c) => (
              <Link 
                prefetch={true}
                key={c.id} 
                href={`/category/${c.slug}`} 
                onClick={onClose}
                className="mobile-drawer-link"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="mobile-drawer-divider"></div>
          <Link prefetch={true} href="/blog" onClick={onClose} className="mobile-drawer-link">Blog</Link>
          <Link prefetch={true} href="/contact" onClick={onClose} className="mobile-drawer-link">Customer Service</Link>
          <Link prefetch={true} href="/returns" onClick={onClose} className="mobile-drawer-link">Returns Policy</Link>
        </div>
      </div>
    </>
  );
}
