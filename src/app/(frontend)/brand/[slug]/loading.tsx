import React from 'react';

export default function LoadingBrand() {
  return (
    <main>
      {/* Breadcrumb Skeleton */}
      <div style={{ background: '#f8fafc', padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ padding: '0', display: 'flex', gap: '8px' }}>
          <div style={{ height: '16px', width: '200px', background: '#f1f5f9', borderRadius: '4px' }}></div>
        </div>
      </div>

      {/* Brand Hero Skeleton */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '40px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '600px', flex: 1 }}>
            <div style={{ height: '40px', width: '80%', background: '#f1f5f9', borderRadius: '8px', marginBottom: '16px' }}></div>
            <div style={{ height: '24px', width: '60%', background: '#f8fafc', borderRadius: '6px' }}></div>
          </div>
          <div style={{ width: '150px', height: '150px', background: '#f8fafc', borderRadius: '16px' }}></div>
        </div>
      </section>

      {/* Product Grid Skeleton */}
      <section style={{ padding: '48px 0', background: '#fafafa' }}>
        <div className="container">
          <div className="layout-grid" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px', alignItems: 'start' }}>
            {/* Sidebar Skeleton */}
            <div style={{ display: 'none', flexDirection: 'column', gap: '16px' }} className="skeleton-sidebar">
              <div style={{ height: '32px', width: '100%', background: '#f1f5f9', borderRadius: '8px' }}></div>
              <div style={{ height: '200px', width: '100%', background: '#f8fafc', borderRadius: '12px' }}></div>
              <div style={{ height: '200px', width: '100%', background: '#f8fafc', borderRadius: '12px' }}></div>
            </div>

            {/* Grid Skeleton */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ height: '20px', width: '150px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                <div style={{ height: '36px', width: '120px', background: '#f8fafc', borderRadius: '8px' }}></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ width: '100%', aspectRatio: '1/1', background: '#f8fafc', borderRadius: '12px' }}></div>
                    <div style={{ height: '16px', width: '80%', background: '#f1f5f9', borderRadius: '4px' }}></div>
                    <div style={{ height: '20px', width: '50%', background: '#e2e8f0', borderRadius: '4px' }}></div>
                    <div style={{ height: '40px', width: '100%', background: '#f8fafc', borderRadius: '8px', marginTop: '12px' }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 900px) {
          .skeleton-sidebar {
            display: flex !important;
          }
        }
      `}} />
    </main>
  );
}
