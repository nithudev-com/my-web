'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toggleShippingStatus, deleteShippingMethod } from '../actions';
import { useRouter } from 'next/navigation';

export function ShippingListClient({ methods }: { methods: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    const res = await toggleShippingStatus(id, !currentStatus);
    if (!res.success) {
      alert('Failed to toggle status: ' + res.error);
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this shipping method?')) {
      setLoadingId(id);
      const res = await deleteShippingMethod(id);
      if (!res.success) {
        alert('Failed to delete method: ' + res.error);
      }
      setLoadingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#111111' }}>Shipping Zones</h1>
        <Link href="/admin/settings/shipping/new" className="dashboard-btn-primary" style={{ textDecoration: 'none' }}>
          Add Shipping Method
        </Link>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Method Name</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Estimated Days</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Price</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {methods.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No shipping methods configured yet.</td>
              </tr>
            ) : methods.map(method => {
              const strId = method.id.toString();
              const isProcessing = loadingId === strId;
              
              return (
                <tr key={strId} style={{ borderBottom: '1px solid #e2e8f0', background: isProcessing ? '#f1f5f9' : '#fff', opacity: isProcessing ? 0.6 : 1 }}>
                  <td style={{ padding: '16px', fontWeight: '700', color: '#111111' }}>
                    {method.name}
                  </td>
                  <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                    {method.estimatedDays || 'Not specified'}
                  </td>
                  <td style={{ padding: '16px', fontWeight: '700', color: '#111111' }}>
                    ${Number(method.price).toFixed(2)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => handleToggle(strId, method.isActive)}
                      disabled={isProcessing}
                      style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer',
                        background: method.isActive ? '#ecfdf5' : '#f1f5f9', 
                        color: method.isActive ? '#10b981' : '#64748b' 
                      }}
                    >
                      {method.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/settings/shipping/${strId}/edit`} style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(strId)}
                        disabled={isProcessing}
                        style={{ padding: '6px 12px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
