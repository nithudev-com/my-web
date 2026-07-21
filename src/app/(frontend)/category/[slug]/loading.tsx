import React from 'react';

export default function LoadingCategory() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', paddingTop: '24px', paddingBottom: '80px' }}>
      {/* Breadcrumb Skeleton */}
      <div style={{ height: '20px', width: '200px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '24px' }}></div>
      
      {/* Title Skeleton */}
      <div style={{ height: '40px', width: '300px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '16px' }}></div>
      
      {/* Subcategories Skeleton */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: '36px', width: '120px', background: '#f1f5f9', borderRadius: '20px', flexShrink: 0 }}></div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Sidebar Skeleton (Desktop only) */}
        <div style={{ width: '260px', display: 'none' }} className="desktop-sidebar-skeleton">
          <div style={{ height: '400px', width: '100%', background: '#f8fafc', borderRadius: '16px' }}></div>
        </div>

        {/* Product Grid Skeleton */}
        <div style={{ flex: 1 }}>
          {/* Controls Skeleton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ height: '24px', width: '150px', background: '#f1f5f9', borderRadius: '4px' }}></div>
            <div style={{ height: '36px', width: '120px', background: '#f1f5f9', borderRadius: '8px' }}></div>
          </div>
          
          {/* Grid */}
          <div className="skeleton-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', height: '380px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, background: '#f8fafc' }}></div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ height: '16px', width: '80%', background: '#e2e8f0', borderRadius: '4px' }}></div>
                  <div style={{ height: '14px', width: '40%', background: '#f1f5f9', borderRadius: '4px' }}></div>
                  <div style={{ height: '24px', width: '60%', background: '#e2e8f0', borderRadius: '4px', marginTop: 'auto' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          .desktop-sidebar-skeleton { display: block !important; }
        }
        @media (max-width: 600px) {
          .skeleton-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}} />
    </div>
  );
}
