import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Account Issues | Google Merchant" };

export default async function AccountIssuesPage() {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  const issues = await prisma.googleMerchantIssue.findMany({
    where: { issueType: "ACCOUNT", status: "ACTIVE" },
    orderBy: { severity: "asc" }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Account Issues</h1>
        <form action="/api/admin/google-merchant/account-issues/refresh" method="POST">
          <button type="submit" className="button" style={{ background: '#0f172a', color: 'white' }}>Refresh Issues</button>
        </form>
      </div>
      
      <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {issues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No Account Issues Found</h3>
            <p style={{ margin: 0 }}>Your Merchant Center account is in good standing.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Severity</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Issue</th>
                <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: '500' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id.toString()} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '999px', 
                      fontSize: '12px',
                      background: issue.severity === 'ERROR' ? '#fee2e2' : '#fef3c7',
                      color: issue.severity === 'ERROR' ? '#991b1b' : '#92400e',
                      fontWeight: 'bold'
                    }}>
                      {issue.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: '500', color: '#0f172a' }}>{issue.title}</div>
                    <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{issue.description}</div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {issue.documentationUrl && (
                      <a href={issue.documentationUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0f172a', textDecoration: 'underline' }}>Learn More</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
