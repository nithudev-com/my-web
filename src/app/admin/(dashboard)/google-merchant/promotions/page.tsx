import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Promotions | Google Merchant" };

export default async function PromotionsPage() {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  // Fetch capabilities
  const connection = await prisma.googleMerchantConnection.findFirst({
    where: { status: "CONNECTED" }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Promotions</h1>
        <button type="button" className="button" style={{ background: '#2563eb', color: 'white' }}>Create Promotion</button>
      </div>

      {!connection ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px' }}>
          <h4 style={{ color: '#b91c1c', margin: '0 0 8px 0' }}>Not Connected</h4>
          <p style={{ color: '#b91c1c', margin: 0 }}>You must connect a Google Merchant Center account to use Promotions.</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No Active Promotions</h3>
            <p style={{ margin: 0, marginBottom: '16px' }}>Sync your store's coupons to Google Merchant Center to show special offers on Shopping ads and free listings.</p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Note: Your account must be eligible for Promotions in Google Merchant Center.</p>
          </div>
        </div>
      )}
    </div>
  );
}
