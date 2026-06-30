'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteCustomer, toggleBlockCustomer } from '../actions';

export function CustomerListClient({ initialCustomers }: { initialCustomers: any[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    (c.firstName && c.firstName.toLowerCase().includes(search.toLowerCase())) ||
    (c.lastName && c.lastName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleBlock = async (id: string, currentStatus: boolean) => {
    if (confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this customer?`)) {
      setLoadingId(id);
      const res = await toggleBlockCustomer(id, !currentStatus);
      if (res.success) {
        setCustomers(prev => prev.map(c => c.id.toString() === id ? { ...c, isBlocked: !currentStatus } : c));
      }
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('WARNING: This will permanently delete the customer, their addresses, wishlist, and conversations. Orders may be orphaned. Continue?')) {
      setLoadingId(id);
      const res = await deleteCustomer(id);
      if (res.success) {
        setCustomers(prev => prev.filter(c => c.id.toString() !== id));
      }
      setLoadingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#111111' }}>Customer Management</h1>
        <input 
          type="text" 
          placeholder="Search by email or name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '300px' }}
        />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Customer Info</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Registration Date</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Orders</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No customers found.</td>
              </tr>
            ) : filteredCustomers.map(customer => {
              const strId = customer.id.toString();
              const isProcessing = loadingId === strId;
              
              return (
                <tr key={strId} style={{ borderBottom: '1px solid #e2e8f0', background: isProcessing ? '#f1f5f9' : '#fff', opacity: isProcessing ? 0.6 : 1 }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '700', color: '#111111' }}>{customer.firstName} {customer.lastName}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{customer.email}</div>
                    {customer.phone && <div style={{ fontSize: '12px', color: '#94a3b8' }}>{customer.phone}</div>}
                  </td>
                  <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                    {customer.orders}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {customer.isBlocked ? (
                      <span style={{ padding: '4px 8px', background: '#fef2f2', color: '#ef4444', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>Blocked</span>
                    ) : (
                      <span style={{ padding: '4px 8px', background: '#ecfdf5', color: '#10b981', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>Active</span>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/customers/${strId}/edit`} style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleToggleBlock(strId, customer.isBlocked)}
                        disabled={isProcessing}
                        style={{ padding: '6px 12px', background: customer.isBlocked ? '#ecfdf5' : '#fef3c7', color: customer.isBlocked ? '#10b981' : '#d97706', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        {customer.isBlocked ? 'Unblock' : 'Block'}
                      </button>
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
