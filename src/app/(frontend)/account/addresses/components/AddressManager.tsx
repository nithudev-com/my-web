'use client';

import React, { useState, useTransition } from 'react';
import { saveAddress, deleteAddress, setDefaultAddress } from '../actions';

export function AddressManager({ addresses }: { addresses: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenModal = (address?: any) => {
    setEditingAddress(address || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    startTransition(async () => {
      const res = await deleteAddress(id);
      if (res.error) alert(res.error);
    });
  };

  const handleSetDefault = (id: string, type: 'shipping' | 'billing') => {
    startTransition(async () => {
      const res = await setDefaultAddress(id, type);
      if (res.error) alert(res.error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingAddress) {
      formData.append('id', editingAddress.id.toString());
    }
    
    startTransition(async () => {
      const res = await saveAddress(formData);
      if (res.error) {
        alert(res.error);
      } else {
        handleCloseModal();
      }
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Saved Addresses</h1>
        <button onClick={() => handleOpenModal()} className="button" style={{ padding: '8px 16px', fontSize: '14px' }}>
          + Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>You haven't saved any addresses yet.</p>
          <button onClick={() => handleOpenModal()} className="button" style={{ padding: '8px 24px' }}>Add Address</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {addresses.map((address) => (
            <div key={address.id.toString()} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#fff', position: 'relative' }}>
              {(address.isDefaultShipping || address.isDefaultBilling) && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {address.isDefaultShipping && <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Default Shipping</span>}
                  {address.isDefaultBilling && <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Default Billing</span>}
                </div>
              )}
              
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{address.firstName} {address.lastName}</div>
              {address.company && <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>{address.company}</div>}
              <div style={{ color: '#475569', fontSize: '14px', lineHeight: 1.5 }}>
                {address.addressLine1}<br />
                {address.addressLine2 && <>{address.addressLine2}<br /></>}
                {address.city}, {address.state} {address.postalCode}<br />
                {address.country}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => handleOpenModal(address)} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                <button onClick={() => handleDelete(address.id.toString())} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  {!address.isDefaultShipping && (
                    <button onClick={() => handleSetDefault(address.id.toString(), 'shipping')} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Set as Shipping</button>
                  )}
                  {!address.isDefaultBilling && (
                    <button onClick={() => handleSetDefault(address.id.toString(), 'billing')} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Set as Billing</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>First Name</label>
                  <input type="text" name="firstName" defaultValue={editingAddress?.firstName} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Last Name</label>
                  <input type="text" name="lastName" defaultValue={editingAddress?.lastName} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Address Line 1</label>
                <input type="text" name="addressLine1" defaultValue={editingAddress?.addressLine1} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Address Line 2 (Optional)</label>
                <input type="text" name="addressLine2" defaultValue={editingAddress?.addressLine2} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>City</label>
                  <input type="text" name="city" defaultValue={editingAddress?.city} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>State / Province</label>
                  <input type="text" name="state" defaultValue={editingAddress?.state} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Postal Code</label>
                  <input type="text" name="postalCode" defaultValue={editingAddress?.postalCode} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Country</label>
                  <select name="country" defaultValue={editingAddress?.country || 'Canada'} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <input type="hidden" name="isDefaultShipping" value="on" />
              <input type="hidden" name="isDefaultBilling" value="on" />

              <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="button" disabled={isPending} style={{ flex: 1 }}>{isPending ? 'Saving...' : 'Save Address'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
