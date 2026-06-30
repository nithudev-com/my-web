import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/money";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Products</h1>
        <Link href="/admin/products/new" className="button secondary">Add Product</Link>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 0' }}>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {await Promise.all(products.map(async (p) => (
              <tr key={p.id.toString()} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 0' }}>{p.title}</td>
                <td>{p.sku}</td>
                <td>{p.category?.name || 'N/A'}</td>
                <td>{await formatPrice(Number(p.basePrice))}</td>
                <td>{p.stockQuantity}</td>
                <td>{p.status}</td>
                <td>
                  <Link href={`/admin/products/${p.id.toString()}/edit`} style={{ color: 'var(--accent)', marginRight: '12px' }}>Edit</Link>
                  <DeleteButton id={p.id.toString()} />
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
