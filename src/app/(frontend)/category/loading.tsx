import React from 'react';

export default function LoadingAllCategories() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 16px' }}>
      <div style={{ height: '40px', width: '250px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '32px' }}></div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '16px', gap: '16px' }}>
            <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '12px', flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ height: '20px', width: '80%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div style={{ height: '14px', width: '50%', background: '#f1f5f9', borderRadius: '4px' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
