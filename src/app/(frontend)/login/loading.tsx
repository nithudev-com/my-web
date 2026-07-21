import React from 'react';

export default function LoadingLogin() {
  return (
    <main className="auth-wrapper">
      <div className="auth-bg-glow"></div>
      <div className="auth-shape-1"></div>
      <div className="auth-shape-2"></div>

      <div className="auth-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ height: '32px', width: '200px', background: '#f1f5f9', borderRadius: '8px', margin: '0 auto 16px' }}></div>
          <div style={{ height: '16px', width: '250px', background: '#f1f5f9', borderRadius: '4px', margin: '0 auto' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ height: '14px', width: '100px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '8px' }}></div>
            <div style={{ height: '48px', width: '100%', background: '#f8fafc', borderRadius: '12px' }}></div>
          </div>
          <div>
            <div style={{ height: '14px', width: '80px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '8px' }}></div>
            <div style={{ height: '48px', width: '100%', background: '#f8fafc', borderRadius: '12px' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ height: '16px', width: '120px', background: '#f1f5f9', borderRadius: '4px' }}></div>
            <div style={{ height: '16px', width: '120px', background: '#f1f5f9', borderRadius: '4px' }}></div>
          </div>
          <div style={{ height: '48px', width: '100%', background: '#e2e8f0', borderRadius: '16px', marginTop: '8px' }}></div>
        </div>
      </div>
    </main>
  );
}
