'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchHeader({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/search`);
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <form onSubmit={handleSearch} style={{ flexGrow: 1, position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '14px 48px 14px 48px', 
            borderRadius: '24px', 
            border: 'none', 
            background: '#f8fafc',
            fontSize: '15px',
            outline: 'none',
            color: '#0f172a'
          }}
        />
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <button type="submit" style={{ 
          position: 'absolute', 
          right: '8px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          background: '#FBBF24', 
          border: 'none', 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          cursor: 'pointer'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </form>
    </div>
  );
}
