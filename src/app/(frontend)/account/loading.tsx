export default function AccountLoading() {
  return (
    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="skeleton-pulse" style={{ width: '200px', height: '32px', borderRadius: '8px', background: '#F0DDE5' }}></div>
      <div className="skeleton-pulse" style={{ width: '100%', height: '120px', borderRadius: '16px', background: '#F0DDE5' }}></div>
      <div className="skeleton-pulse" style={{ width: '100%', height: '120px', borderRadius: '16px', background: '#F0DDE5' }}></div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .skeleton-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />
    </div>
  );
}
