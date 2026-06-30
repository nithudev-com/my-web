'use client';

export default function PrintButton() {
  return (
    <div className="no-print" style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', gap: '16px' }}>
      <button 
        onClick={() => window.print()} 
        style={{ padding: '12px 32px', background: '#111111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
      >
        🖨️ Print / Save as PDF
      </button>
      <button 
        onClick={() => window.close()} 
        style={{ padding: '12px 32px', background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
      >
        Close Window
      </button>
    </div>
  );
}
