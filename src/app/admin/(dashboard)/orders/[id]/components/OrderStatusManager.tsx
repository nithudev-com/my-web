'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '../../actions';

export function OrderStatusManager({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      setLoading(true);
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert('Failed to update status: ' + res.error);
      }
      setLoading(false);
    } else {
      // Revert selection visually
      e.target.value = currentStatus;
    }
  };

  const statuses = ['PENDING', 'PROCESSING', 'PAID', 'DELIVERED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Fulfillment Status</label>
      <select 
        defaultValue={currentStatus} 
        onChange={handleStatusChange}
        disabled={loading}
        style={{ 
          padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', 
          outline: 'none', background: loading ? '#f1f5f9' : '#fff',
          fontWeight: '600', color: '#111111', cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
