'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const cart = useCartContext();

  if (pathname.startsWith('/account')) {
    return null;
  }

  const totalCartItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistItems = 0; // The original Header wishlist badge just says '0'

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      name: 'Shop',
      href: '/search',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )
    },
    {
      name: 'Wishlist',
      href: '/account/wishlist',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      badge: totalWishlistItems > 0 ? totalWishlistItems : null
    },
    {
      name: 'Cart',
      onClick: cart.openCart,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
      badge: cart.isLoaded && totalCartItems > 0 ? totalCartItems : null
    },
    {
      name: 'Profile',
      href: '/account',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .mobile-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            border-top: 1px solid #e2e8f0;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
            padding-bottom: env(safe-area-inset-bottom, 0px);
            z-index: 10000;
            justify-content: space-around;
            align-items: center;
          }
          body {
            padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px)) !important;
          }
          .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 12px 8px;
            text-decoration: none;
            color: #94a3b8; /* Inactive color */
            position: relative;
            background: transparent;
            border: none;
            font-family: inherit;
            cursor: pointer;
            width: 100%;
            transition: color 0.2s ease;
            -webkit-tap-highlight-color: transparent;
          }
          .mobile-nav-item:active {
            opacity: 0.7;
          }
          .mobile-nav-item.active {
            color: #0f172a; /* Active color black */
          }
          .mobile-nav-icon {
            margin-bottom: 4px;
            display: flex;
            position: relative;
          }
          .mobile-nav-label {
            font-size: 11px;
            font-weight: 700;
          }
          .mobile-nav-badge {
            position: absolute;
            top: -6px;
            right: -8px;
            background: #FBBF24; /* Bright warm yellow */
            color: #000;
            font-size: 10px;
            font-weight: 800;
            border-radius: 10px;
            padding: 2px 5px;
            min-width: 16px;
            text-align: center;
            line-height: 1.2;
            border: 2px solid #fff;
          }
        }
      `}} />
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => {
          const isActive = item.href ? (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)) : false;
          
          const content = (
            <>
              <div className="mobile-nav-icon">
                {item.icon}
                {item.badge !== null && item.badge !== undefined && (
                  <span className="mobile-nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-nav-label">{item.name}</span>
            </>
          );

          if (item.href) {
            return (
              <Link key={item.name} href={item.href} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
                {content}
              </Link>
            );
          }

          return (
            <button key={item.name} onClick={item.onClick} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
              {content}
            </button>
          );
        })}
      </nav>
    </>
  );
}
