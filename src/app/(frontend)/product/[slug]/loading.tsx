import React from 'react';

export default function LoadingProduct() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', paddingTop: '24px', paddingBottom: '80px' }}>
      {/* Breadcrumb Skeleton */}
      <div style={{ height: '20px', width: '250px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '24px' }}></div>
      
      <div className="product-layout-skeleton" style={{ display: 'grid', gap: '48px', alignItems: 'start' }}>
        {/* Images Skeleton */}
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <div style={{ width: '100%', aspectRatio: '1/1', background: '#f8fafc', borderRadius: '24px' }}></div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '12px', flexShrink: 0 }}></div>
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ height: '16px', width: '120px', background: '#f1f5f9', borderRadius: '4px' }}></div>
          <div style={{ height: '48px', width: '80%', background: '#e2e8f0', borderRadius: '8px' }}></div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ height: '20px', width: '100px', background: '#f1f5f9', borderRadius: '4px' }}></div>
            <div style={{ height: '20px', width: '100px', background: '#f1f5f9', borderRadius: '4px' }}></div>
          </div>
          
          <div style={{ height: '48px', width: '160px', background: '#f1f5f9', borderRadius: '8px', marginTop: '12px' }}></div>
          
          <div style={{ height: '100px', width: '100%', background: '#f8fafc', borderRadius: '12px', marginTop: '16px' }}></div>
          
          <div style={{ height: '56px', width: '100%', background: '#e2e8f0', borderRadius: '16px', marginTop: '24px' }}></div>
        </div>
      </div>

      
    </div>
  );
}
