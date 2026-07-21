'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createShippingMethod, updateShippingMethod } from '../actions';

export function ShippingForm({ method }: { method?: any }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const isEditing = !!method;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    
    let res;
    if (isEditing) {
      res = await updateShippingMethod(method.id.toString(), formData);
    } else {
      res = await createShippingMethod(formData);
    }

    if (res.success) {
      router.push('/admin/settings/shipping');
    } else {
      setErrorMsg(res.error || 'Failed to save shipping method.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {errorMsg && (
        <div style={{ padding: '16px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', border: '1px solid #fca5a5', fontWeight: '600' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Shipping Method Name <span style={{color: '#ef4444'}}>*</span></label>
        <input 
          type="text" 
          name="name" 
          required 
          defaultValue={method?.name || ''} 
          placeholder="e.g. Standard Ground Shipping"
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Price (CAD) <span style={{color: '#ef4444'}}>*</span></label>
          <input 
            type="number" 
            step="0.01" 
            min="0"
            name="price" 
            required 
            defaultValue={method?.price || ''} 
            placeholder="0.00"
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Estimated Delivery Time</label>
          <input 
            type="text" 
            name="estimatedDays" 
            defaultValue={method?.estimatedDays || ''} 
            placeholder="e.g. 3-5 Business Days"
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <button 
          type="button" 
          onClick={() => router.push('/admin/settings/shipping')}
          style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="dashboard-btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Method')}
        </button>
      </div>
    </form>
  );
}
