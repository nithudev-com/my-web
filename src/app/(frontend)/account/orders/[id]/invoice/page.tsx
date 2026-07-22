import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import PrintButton from './PrintButton';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const customerIdStr = cookieStore.get('customer_auth')?.value;
  
  if (!customerIdStr) redirect('/login');
  const customerId = BigInt(customerIdStr);
  
  const resolvedParams = await params;
  let orderId: bigint;
  try {
    orderId = BigInt(resolvedParams.id);
  } catch {
    return notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order || order.customerId !== customerId) return notFound();

  const billingAddr: any = order.billingAddress || order.shippingAddress || {};
  const shippingAddr: any = order.shippingAddress || {};

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      

      <PrintButton />

      <div className="invoice-body">
        <div className="invoice-container">
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '24px', marginBottom: '32px' }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: '32px', fontWeight: '900', letterSpacing: '-0.04em' }}>SexToys Lovers</h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>123 Tech Lane, Innovation District<br/>New York, NY 10001<br/>info@sextoyslovers.com</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '36px', fontWeight: '900', color: '#cbd5e1', textTransform: 'uppercase' }}>Invoice</h2>
              <p style={{ margin: '0 0 4px', fontSize: '14px' }}><strong>Order #:</strong> {order.orderNumber}</p>
              <p style={{ margin: '0', fontSize: '14px' }}><strong>Date:</strong> {order.createdAt.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Addresses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 12px', letterSpacing: '0.05em' }}>Billed To</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>{billingAddr.firstName} {billingAddr.lastName}</strong><br/>
                {billingAddr.addressLine1}<br/>
                {billingAddr.addressLine2 && <>{billingAddr.addressLine2}<br/></>}
                {billingAddr.city}, {billingAddr.state} {billingAddr.postalCode}<br/>
                {billingAddr.country}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 12px', letterSpacing: '0.05em' }}>Shipped To</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>{shippingAddr.firstName} {shippingAddr.lastName}</strong><br/>
                {shippingAddr.addressLine1}<br/>
                {shippingAddr.addressLine2 && <>{shippingAddr.addressLine2}<br/></>}
                {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postalCode}<br/>
                {shippingAddr.country}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id.toString()}>
                  <td style={{ fontWeight: '600' }}>{item.title}</td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{order.currency === 'CAD' ? 'CA$' : '$'}{Number(item.unitPrice).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: '800' }}>{order.currency === 'CAD' ? 'CA$' : '$'}{Number(item.totalPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <table style={{ width: '300px', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', color: '#64748b' }}>Subtotal</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600' }}>{order.currency === 'CAD' ? 'CA$' : '$'}{Number(order.totalAmount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', color: '#64748b' }}>Shipping</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600' }}>$0.00</td>
                </tr>
                <tr style={{ borderTop: '2px solid #0f172a' }}>
                  <td style={{ padding: '16px 8px', fontSize: '18px', fontWeight: '900' }}>Total</td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', fontSize: '18px', fontWeight: '900' }}>
                    {order.currency === 'CAD' ? 'CA$' : '$'}{Number(order.totalAmount).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>Thank you for your business. For any inquiries regarding this invoice, please contact info@sextoyslovers.com.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
