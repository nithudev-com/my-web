const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'products', title: 'Products' },
  { path: 'sync', title: 'Sync Center' },
  { path: 'field-mapping', title: 'Field Mapping' },
  { path: 'feed-rules', title: 'Feed Rules' },
  { path: 'shipping-returns', title: 'Shipping & Returns' },
  { path: 'performance', title: 'Performance' },
  { path: 'price-insights', title: 'Price Insights' },
  { path: 'notifications', title: 'Notifications' },
  { path: 'activity-logs', title: 'Activity Logs' }
];

const baseDir = path.join(__dirname, '../src/app/admin/(dashboard)/google-merchant');

pages.forEach(page => {
  const dirPath = path.join(baseDir, page.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    const content = `import { requireAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const metadata = { title: "${page.title} | Google Merchant" };

export default async function ${page.title.replace(/[^a-zA-Z]/g, '')}Page() {
  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>${page.title}</h1>
      <div style={{ background: 'white', borderRadius: '8px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', color: '#cbd5e1' }}>🚧</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Under Construction</h3>
        <p style={{ margin: 0, color: '#64748b' }}>This module will be available in a future update.</p>
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(filePath, content);
  }
});
console.log('Pages created.');
