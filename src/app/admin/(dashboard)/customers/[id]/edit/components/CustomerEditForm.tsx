'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCustomer } from '../../../actions';

export function CustomerEditForm({ customer }: { customer: any }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    formData.append('id', customer.id.toString());
    
    const res = await updateCustomer(formData);
    if (res.success) {
      setSuccessMsg('Customer details updated successfully.');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to update customer.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {errorMsg && (
        <div style={{ padding: '16px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', border: '1px solid #fca5a5', fontWeight: '600' }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: '16px', background: '#ecfdf5', color: '#10b981', borderRadius: '8px', border: '1px solid #a7f3d0', fontWeight: '600' }}>
          {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>First Name</label>
          <input type="text" name="firstName" defaultValue={customer.firstName || ''} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Last Name</label>
          <input type="text" name="lastName" defaultValue={customer.lastName || ''} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Email Address</label>
          <input type="email" name="email" required defaultValue={customer.email} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Phone Number</label>
          <input type="tel" name="phone" defaultValue={customer.phone || ''} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button type="submit" disabled={loading} className="dashboard-btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
