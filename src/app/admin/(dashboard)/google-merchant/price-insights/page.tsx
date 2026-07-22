import { requireAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Price Insights | Google Merchant" };

export default async function PriceInsightsPage() {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Price Insights</h1>
      <div style={{ background: 'white', borderRadius: '8px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', color: '#cbd5e1' }}>🚧</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Under Construction</h3>
        <p style={{ margin: 0, color: '#64748b' }}>This module will be available in a future update.</p>
      </div>
    </div>
  );
}
