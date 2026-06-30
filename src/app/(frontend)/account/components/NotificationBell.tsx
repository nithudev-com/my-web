'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Order Shipped!', message: 'Your order #ORD-8821 has been shipped and is on its way.', date: '2 hours ago', read: false },
  { id: 2, title: 'Welcome to Monirize', message: 'Thanks for creating an account. Enjoy premium shopping!', date: '2 days ago', read: false },
  { id: 3, title: 'Price Drop Alert', message: 'An item on your wishlist is now on sale.', date: '1 week ago', read: true },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? '#f1f5f9' : 'transparent',
          border: 'none',
          padding: '8px',
          borderRadius: '50%',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: '0.2s',
          color: '#475569'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '6px',
            width: '10px',
            height: '10px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: '2px solid #FFFFFF'
          }}></span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '320px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid #F0DDE5',
          overflow: 'hidden',
          zIndex: 50,
          animation: 'dropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '800', color: '#111111' }}>Notifications</span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                style={{ background: 'none', border: 'none', color: '#D63062', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.map(n => (
              <div key={n.id} style={{ 
                padding: '16px', 
                borderBottom: '1px solid #f8fafc',
                background: n.read ? '#FFFFFF' : '#fef2f2',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = n.read ? '#FFFFFF' : '#fef2f2'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: n.read ? '600' : '800', color: '#111111' }}>{n.title}</h4>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{n.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>{n.message}</p>
              </div>
            ))}
          </div>
          
          <div style={{ padding: '12px', background: '#f8fafc', textAlign: 'center' }}>
            <Link href="/account" style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>View Dashboard</Link>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
