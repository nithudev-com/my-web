'use client';

import { useState } from 'react';
import { updateProfile } from '../actions';

export function ProfileForm({ customer }: { customer: any }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.success) {
      setMsg({ type: 'success', text: result.message || 'Updated!' });
    } else {
      setMsg({ type: 'error', text: result.error || 'Error' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>First Name</label>
          <input 
            type="text" 
            name="firstName" 
            defaultValue={customer.firstName} 
            required 
            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #F0DDE5', fontSize: '15px', outline: 'none' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#D63062'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#F0DDE5'}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Last Name</label>
          <input 
            type="text" 
            name="lastName" 
            defaultValue={customer.lastName} 
            required 
            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #F0DDE5', fontSize: '15px', outline: 'none' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#D63062'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#F0DDE5'}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Phone Number (Optional)</label>
        <input 
          type="tel" 
          name="phone" 
          defaultValue={customer.phone || ''} 
          style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #F0DDE5', fontSize: '15px', outline: 'none' }} 
          onFocus={(e) => e.currentTarget.style.borderColor = '#D63062'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#F0DDE5'}
        />
      </div>

      {msg.text && (
        <div style={{ padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', 
          background: msg.type === 'error' ? '#fef2f2' : '#ecfdf5', 
          color: msg.type === 'error' ? '#ef4444' : '#10b981' 
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button type="submit" className="dashboard-btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  );
}
