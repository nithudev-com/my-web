import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { mapProductToGoogle } from "@/server/google-merchant/mapper";
import { validateProductPayload } from "@/server/google-merchant/validator";

export default async function GoogleMerchantProductConfig(props: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  const params = await props.params;
  const productId = BigInt(params.id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { brand: true, category: true }
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  // Active Connection
  const connection = await prisma.googleMerchantConnection.findFirst({
    where: { status: "CONNECTED" }
  });

  if (!connection) {
    return (
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Google Merchant Configuration</h1>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px' }}>
          <h4 style={{ color: '#b91c1c', margin: '0 0 8px 0' }}>Not Connected</h4>
          <p style={{ color: '#b91c1c', margin: 0 }}>You must connect a Google Merchant Center account before configuring products.</p>
          <Link href="/admin/google-merchant/connection" style={{ display: 'inline-block', marginTop: '12px', background: '#b91c1c', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>
            Go to Connection Settings
          </Link>
        </div>
      </div>
    );
  }

  // Get Config
  let config = await prisma.googleProductConfiguration.findUnique({
    where: { productId }
  });

  if (!config) {
    config = await prisma.googleProductConfiguration.create({
      data: {
        productId,
        connectionId: connection.id,
        offerId: product.sku,
      }
    });
  }

  const payload = mapProductToGoogle(product, config, []);
  const validation = validateProductPayload(payload);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Link href={`/admin/products/${product.id}/edit`} style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px', marginBottom: '8px', display: 'inline-block' }}>&larr; Back to Product</Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Google Merchant Configuration</h1>
          <p className="muted" style={{ margin: '4px 0 0 0' }}>{product.title} (SKU: {product.sku})</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <form action={`/api/admin/google-merchant/products/${product.id}/sync`} method="POST">
            <button type="submit" disabled={validation.status === "BLOCKED"} style={{ padding: '10px 20px', background: validation.status === "BLOCKED" ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: validation.status === "BLOCKED" ? 'not-allowed' : 'pointer' }}>
              Sync Now
            </button>
          </form>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Validation Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ 
                width: '12px', height: '12px', borderRadius: '50%', 
                background: validation.status === 'READY' ? '#10b981' : validation.status === 'WARNING' ? '#f59e0b' : '#ef4444' 
              }}></div>
              <span style={{ fontWeight: 'bold' }}>{validation.status}</span>
            </div>

            {validation.errors.length > 0 && (
              <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#b91c1c' }}>Errors (Blocks Submission)</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#b91c1c' }}>
                  {validation.errors.map((e, i) => <li key={i}><strong>{e.field}:</strong> {e.message}</li>)}
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#b45309' }}>Warnings</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#b45309' }}>
                  {validation.warnings.map((w, i) => <li key={i}><strong>{w.field}:</strong> {w.message}</li>)}
                </ul>
              </div>
            )}
          </div>

          <form action={`/api/admin/google-merchant/products/${product.id}/update-config`} method="POST">
            <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Field Overrides & Settings</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <input type="checkbox" name="enabled" defaultChecked={config.enabled} style={{ cursor: 'pointer' }} />
                    Enable Google Listing
                  </label>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Google Product Category</label>
                  <input type="text" name="googleProductCategory" defaultValue={config.googleProductCategory || ""} className="input" placeholder="e.g. 166 (Apparel & Accessories)" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Target Country</label>
                  <input type="text" name="targetCountry" defaultValue={config.targetCountry || ""} className="input" placeholder="e.g. US" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Content Language</label>
                  <input type="text" name="contentLanguage" defaultValue={config.contentLanguage || ""} className="input" placeholder="e.g. en" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title Override</label>
                  <input type="text" name="titleOverride" defaultValue={config.titleOverride || ""} className="input" placeholder="Overrides product title" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description Override</label>
                  <textarea name="descriptionOverride" defaultValue={config.descriptionOverride || ""} className="input" style={{ minHeight: '100px' }} placeholder="Overrides product description"></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Condition</label>
                  <select name="condition" defaultValue={config.condition || "new"} className="input">
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                <div>
                  <button type="submit" className="button" style={{ background: '#0f172a', color: 'white' }}>Save Overrides</button>
                </div>
              </div>
            </div>
          </form>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Payload Preview</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>This is the mapped data that will be sent to Google.</p>
            <pre style={{ background: '#1e293b', color: '#a5b4fc', padding: '16px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto' }}>
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
