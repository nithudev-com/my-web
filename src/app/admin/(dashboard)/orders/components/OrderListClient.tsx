'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export function OrderListClient({ initialOrders }: { initialOrders: any[] }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const tabs = ['ALL', 'PENDING', 'PROCESSING', 'PAID', 'DELIVERED', 'CANCELLED'];

  const filteredOrders = useMemo(() => {
    return initialOrders.filter(o => {
      const matchesTab = activeTab === 'ALL' || o.status === activeTab;
      const matchesSearch = 
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
        o.customerEmail.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [initialOrders, activeTab, search]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return { bg: '#fef3c7', text: '#d97706' };
      case 'PROCESSING': return { bg: '#e0e7ff', text: '#4338ca' };
      case 'PAID': return { bg: '#dbeafe', text: '#1d4ed8' };
      case 'DELIVERED': return { bg: '#ecfdf5', text: '#10b981' };
      case 'CANCELLED': 
      case 'FAILED':
      case 'EXPIRED':
      case 'REFUNDED': return { bg: '#fef2f2', text: '#ef4444' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#111111' }}>Orders Management</h1>
        <input 
          type="text" 
          placeholder="Search order number or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '300px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: 'none',
                background: isActive ? '#0f172a' : '#fff', color: isActive ? '#fff' : '#64748b',
                boxShadow: isActive ? '0 4px 12px rgba(15,23,42,0.15)' : '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Order ID</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Customer</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Total</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No orders found.</td>
              </tr>
            ) : filteredOrders.map(order => {
              const strId = order.id.toString();
              const colors = getStatusColor(order.status);
              
              return (
                <tr key={strId} style={{ borderBottom: '1px solid #e2e8f0', background: '#fff', transition: '0.2s' }}>
                  <td style={{ padding: '16px', fontWeight: '700', color: '#111111' }}>
                    <Link href={`/admin/orders/${strId}`} style={{ color: '#D63062', textDecoration: 'none' }}>
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                    {order.customerEmail}
                  </td>
                  <td style={{ padding: '16px', fontWeight: '700', color: '#111111' }}>
                    {order.currency} {Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', background: colors.bg, color: colors.text, borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <Link href={`/admin/orders/${strId}`} style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                      Manage
                    </Link>
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
