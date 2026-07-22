import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = { title: "Inventory | Google Merchant" };

export default async function InventoryPage() {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  const connection = await prisma.googleMerchantConnection.findFirst({
    where: { status: "CONNECTED" }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Inventory Management</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="button" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }}>Sync Local Inventory</button>
          <button type="button" className="button" style={{ background: '#2563eb', color: 'white' }}>Sync Regional Inventory</button>
        </div>
      </div>

      {!connection ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px' }}>
          <h4 style={{ color: '#b91c1c', margin: '0 0 8px 0' }}>Not Connected</h4>
          <p style={{ color: '#b91c1c', margin: 0 }}>You must connect a Google Merchant Center account to use Advanced Inventory.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Regional Inventory</h3>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>Manage product availability and pricing for specific regions.</p>
            
            <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Regional Overrides: <span style={{ color: '#64748b', fontWeight: 'normal' }}>0 configured</span></p>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Local Inventory</h3>
              <span style={{ padding: '4px 8px', background: '#e2e8f0', color: '#475569', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>DISABLED</span>
            </div>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
              Show physical store availability for nearby shoppers. Requires Local Inventory Ads setup in Merchant Center.
            </p>
            <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Enable Local Inventory in Settings to use this feature.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
