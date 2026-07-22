import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Google Merchant Overview | Admin" };

export default async function GoogleMerchantOverview() {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  const connection = await prisma.googleMerchantConnection.findFirst({
    where: { status: "CONNECTED" }
  });

  if (!connection) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Welcome to Google Merchant Center Integration</h1>
        <p style={{ color: '#475569', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
          Connect your account to seamlessly synchronize your catalog, monitor product approvals, and access performance insights directly from this dashboard.
        </p>
        <Link href="/admin/google-merchant/connection" style={{ display: 'inline-block', padding: '12px 24px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Connect Account
        </Link>
      </div>
    );
  }

  // Get aggregated stats
  const totalProducts = await prisma.product.count({ where: { status: 'ACTIVE' } });
  
  const configuredProducts = await prisma.googleProductConfiguration.count({
    where: { connectionId: connection.id, enabled: true }
  });

  const statuses = await prisma.googleProductStatus.groupBy({
    by: ['approvalState'],
    where: { connectionId: connection.id },
    _count: { approvalState: true }
  });

  const approved = statuses.find(s => s.approvalState === 'APPROVED')?._count.approvalState || 0;
  const disapproved = statuses.find(s => s.approvalState === 'DISAPPROVED')?._count.approvalState || 0;
  const warnings = statuses.find(s => s.approvalState === 'WARNING')?._count.approvalState || 0;
  const processing = statuses.find(s => s.approvalState === 'PROCESSING')?._count.approvalState || 0;

  const accountIssues = await prisma.googleMerchantIssue.count({
    where: { connectionId: connection.id, issueType: 'ACCOUNT', status: 'ACTIVE' }
  });

  const productIssues = await prisma.googleMerchantIssue.count({
    where: { connectionId: connection.id, issueType: 'PRODUCT', status: 'ACTIVE' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Google Merchant Overview</h1>
          <p className="muted" style={{ margin: '4px 0 0 0' }}>Account: {connection.merchantAccountName || connection.merchantAccountId}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <form action="/api/admin/google-merchant/sync/full" method="POST">
            <button type="submit" className="button secondary" style={{ background: '#2563eb' }}>Start Full Sync</button>
          </form>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #3b82f6' }}>
          <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Configured Products</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{configuredProducts} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'normal' }}>/ {totalProducts} active</span></p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #10b981' }}>
          <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Approved by Google</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{approved}</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #ef4444' }}>
          <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Disapproved</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{disapproved}</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #f59e0b' }}>
          <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Warnings & Processing</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{warnings + processing}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Diagnostics</h3>
            <Link href="/admin/google-merchant/account-issues" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: accountIssues > 0 ? '#fef2f2' : '#f8fafc', borderRadius: '6px', border: `1px solid ${accountIssues > 0 ? '#fecaca' : '#e2e8f0'}` }}>
              <span style={{ fontWeight: '500', color: accountIssues > 0 ? '#991b1b' : '#334155' }}>Account Issues</span>
              <span style={{ fontWeight: 'bold', color: accountIssues > 0 ? '#dc2626' : '#64748b' }}>{accountIssues}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: productIssues > 0 ? '#fef2f2' : '#f8fafc', borderRadius: '6px', border: `1px solid ${productIssues > 0 ? '#fecaca' : '#e2e8f0'}` }}>
              <span style={{ fontWeight: '500', color: productIssues > 0 ? '#991b1b' : '#334155' }}>Product Issues</span>
              <span style={{ fontWeight: 'bold', color: productIssues > 0 ? '#dc2626' : '#64748b' }}>{productIssues}</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin/google-merchant/products" style={{ display: 'block', padding: '12px', background: '#f8fafc', borderRadius: '6px', color: '#0f172a', textDecoration: 'none', fontWeight: '500', border: '1px solid #e2e8f0' }}>Manage Products &rarr;</Link>
            <Link href="/admin/google-merchant/sync" style={{ display: 'block', padding: '12px', background: '#f8fafc', borderRadius: '6px', color: '#0f172a', textDecoration: 'none', fontWeight: '500', border: '1px solid #e2e8f0' }}>Sync Center &rarr;</Link>
            <Link href="/admin/google-merchant/field-mapping" style={{ display: 'block', padding: '12px', background: '#f8fafc', borderRadius: '6px', color: '#0f172a', textDecoration: 'none', fontWeight: '500', border: '1px solid #e2e8f0' }}>Field Mapping Rules &rarr;</Link>
            <a href="https://merchants.google.com" target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '12px', background: '#f8fafc', borderRadius: '6px', color: '#2563eb', textDecoration: 'none', fontWeight: '500', border: '1px solid #e2e8f0' }}>Open Google Merchant Center &#8599;</a>
          </div>
        </div>
      </div>
    </div>
  );
}
