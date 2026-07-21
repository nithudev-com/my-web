'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { customerLogout } from '@/app/(frontend)/login/actions';

export function CustomerNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await customerLogout();
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Dashboard Home', href: '/account', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { name: 'My Orders', href: '/account/orders', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16" y1="4" x2="16" y2="20"></line><line x1="8" y1="4" x2="8" y2="20"></line><line x1="3" y1="8" x2="21" y2="8"></line><line x1="3" y1="16" x2="21" y2="16"></line></svg> },
    { name: 'Saved Addresses', href: '/account/addresses', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> },
    { name: 'Recently Viewed', href: '/account/recently-viewed', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> },
    { name: 'Profile Settings', href: '/account/profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
    { name: 'Messages & Support', href: '/account/messages', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> },
    { name: 'My Reviews', href: '/account/reviews', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
  ];

  const getLinkStyle = (href: string) => {
    const isActive = pathname === href;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '15px',
      color: isActive ? '#D63062' : '#111111',
      background: isActive ? '#FFF4F7' : 'transparent',
      transition: 'all 0.2s ease',
    };
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-link:hover { background: #FFF4F7; color: #D63062 !important; }
        .mobile-nav { display: none; }
        .desktop-sidebar { display: block; }
        
        @media (max-width: 900px) {
          .desktop-sidebar { display: none; }
          .mobile-nav { display: flex; }
        }
      `}} />

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{ width: '280px', flexShrink: 0 }}>
        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px 24px', boxShadow: '0 10px 30px -10px rgba(115, 12, 99, 0.08)', border: '1px solid #F0DDE5', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#730C63', marginBottom: '24px', paddingLeft: '8px' }}>My Account</h2>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="sidebar-link" style={getLinkStyle(link.href)}>
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div style={{ height: '1px', background: '#F0DDE5', margin: '16px 0' }}></div>

            <button onClick={handleLogout} className="sidebar-link" style={{ ...getLinkStyle('/logout'), cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%', color: '#E71C25' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation & Slide-out */}
      <div className="mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFFFF', borderTop: '1px solid #F0DDE5', padding: '12px 24px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', justifyContent: 'space-around', alignItems: 'center', zIndex: 100, boxShadow: '0 -4px 20px rgba(115, 12, 99, 0.05)' }}>
        <Link href="/account" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: pathname === '/account' ? '#D63062' : '#64748b' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span style={{ fontSize: '11px', fontWeight: '700' }}>Home</span>
        </Link>
        <Link href="/account/orders" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: pathname === '/account/orders' ? '#D63062' : '#64748b' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16" y1="4" x2="16" y2="20"></line><line x1="8" y1="4" x2="8" y2="20"></line><line x1="3" y1="8" x2="21" y2="8"></line><line x1="3" y1="16" x2="21" y2="16"></line></svg>
          <span style={{ fontSize: '11px', fontWeight: '700' }}>Orders</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#64748b', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <span style={{ fontSize: '11px', fontWeight: '700' }}>Menu</span>
        </button>
      </div>

      {/* Mobile Slide-out Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17, 17, 17, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, animation: 'fadeIn 0.2s ease forwards' }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: '320px', background: '#FFFFFF', padding: '24px', animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#730C63', margin: 0 }}>My Account</h2>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: '#FFF4F7', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#D63062', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={getLinkStyle(link.href)}>
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>

            <button onClick={handleLogout} style={{ ...getLinkStyle('/logout'), cursor: 'pointer', border: '1px solid #F0DDE5', textAlign: 'center', width: '100%', color: '#E71C25', justifyContent: 'center', marginTop: 'auto' }}>
              Logout
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}} />
    </>
  );
}
