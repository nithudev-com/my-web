import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Google Merchant Connection | Admin" };

export default async function GoogleMerchantConnectionPage() {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  // Fetch connection status
  const connections = await prisma.googleMerchantConnection.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const activeConnection = connections.find(c => c.status === "CONNECTED");

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Google Merchant Connection</h1>
      </div>
      
      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Connection Status</h2>
        
        {activeConnection ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
              <span style={{ fontWeight: '500', color: '#10b981' }}>Connected</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p className="muted" style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Account ID</p>
                <p style={{ fontWeight: '500' }}>{activeConnection.merchantAccountId}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Account Name</p>
                <p style={{ fontWeight: '500' }}>{activeConnection.merchantAccountName || 'Unknown'}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Connected Date</p>
                <p style={{ fontWeight: '500' }}>{new Date(activeConnection.connectedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>API Version</p>
                <p style={{ fontWeight: '500' }}>{activeConnection.apiVersion}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <form action="/api/admin/google-merchant/connection/disconnect" method="POST">
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                  onClick={(e) => {
                    if (!confirm('Are you sure you want to disconnect? Product updates will stop working.')) e.preventDefault();
                  }}
                >
                  Disconnect Account
                </button>
              </form>
              <a href="/api/admin/google-merchant/connection/start" style={{ padding: '8px 16px', background: '#e2e8f0', color: '#334155', textDecoration: 'none', borderRadius: '4px', fontWeight: '500' }}>
                Reconnect
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#94a3b8' }}></div>
              <span style={{ fontWeight: '500', color: '#64748b' }}>Not Connected</span>
            </div>
            <p style={{ color: '#475569', marginBottom: '24px', maxWidth: '600px' }}>
              Connect your Google Merchant Center account to synchronize products, retrieve issues, and view performance insights directly from this dashboard.
            </p>
            <a 
              href="/api/admin/google-merchant/connection/start"
              style={{ display: 'inline-block', padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: '500' }}
            >
              Connect Google Merchant Center
            </a>
          </div>
        )}
      </div>

      {connections.length > 0 && (
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Connection History</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Account ID</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Connected At</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Last Success</th>
              </tr>
            </thead>
            <tbody>
              {connections.map(conn => (
                <tr key={conn.id.toString()} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '500' }}>{conn.merchantAccountId}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '999px', 
                      fontSize: '12px',
                      background: conn.status === 'CONNECTED' ? '#d1fae5' : '#f1f5f9',
                      color: conn.status === 'CONNECTED' ? '#047857' : '#475569'
                    }}>
                      {conn.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#475569' }}>{new Date(conn.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '12px 8px', color: '#475569' }}>
                    {conn.lastSuccessfulRequestAt ? new Date(conn.lastSuccessfulRequestAt).toLocaleString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
