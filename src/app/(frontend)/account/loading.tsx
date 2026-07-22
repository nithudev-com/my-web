export default function AccountLoading() {
  return (
    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="skeleton-pulse" style={{ width: '200px', height: '32px', borderRadius: '8px', background: '#F0DDE5' }}></div>
      <div className="skeleton-pulse" style={{ width: '100%', height: '120px', borderRadius: '16px', background: '#F0DDE5' }}></div>
      <div className="skeleton-pulse" style={{ width: '100%', height: '120px', borderRadius: '16px', background: '#F0DDE5' }}></div>
      
      
    </div>
  );
}
