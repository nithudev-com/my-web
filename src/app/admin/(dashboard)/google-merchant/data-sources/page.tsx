import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Data Sources | Google Merchant" };

export default async function DataSourcesPage() {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  const sources = await prisma.googleMerchantDataSource.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Data Sources</h1>
        <form action="/api/admin/google-merchant/data-sources/create" method="POST">
          <button type="submit" className="button" style={{ background: '#2563eb', color: 'white' }}>Create Primary Data Source</button>
        </form>
      </div>
      
      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {sources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No Data Sources</h3>
            <p style={{ margin: 0, marginBottom: '16px' }}>Create an API-based data source to start pushing products.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Name</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Type</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Resource Name</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(source => (
                <tr key={source.id.toString()} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '500', color: '#0f172a' }}>{source.displayName}</td>
                  <td style={{ padding: '12px 8px', color: '#475569' }}>{source.sourceType}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '999px', 
                      fontSize: '12px',
                      background: source.status === 'ACTIVE' ? '#d1fae5' : '#f1f5f9',
                      color: source.status === 'ACTIVE' ? '#047857' : '#475569',
                      fontWeight: 'bold'
                    }}>
                      {source.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#475569', fontSize: '12px', fontFamily: 'monospace' }}>{source.googleResourceName || 'Pending'}</td>
                  <td style={{ padding: '12px 8px', color: '#475569' }}>{new Date(source.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
