'use client';

import { useState } from 'react';
import { submitContactMessage } from '../actions';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
  customer: { firstName: string | null; lastName: string | null; email: string; phone: string | null } | null;
  orders: { orderNumber: string; createdAt: Date }[];
}

export function ContactForm({ customer, orders }: ContactFormProps) {
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
    const result = await submitContactMessage(formData);

    if (result.success) {
      setSuccessMsg('Your message has been sent successfully!');
      if (result.guestToken) {
        // Redirect guests to their secure guest view token URL
        router.push(`/contact/guest/${result.conversationId}?token=${result.guestToken}`);
      } else {
        // Redirect registered users to their dashboard inbox
        router.push(`/account/messages/${result.conversationId}`);
      }
    } else {
      setErrorMsg(result.error || 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-card" style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(115,12,99,0.06)', border: '1px solid #F0DDE5', animation: 'fadeInUp 0.6s ease forwards' }}>
      
      {errorMsg && (
        <div style={{ padding: '16px', background: '#fef2f2', color: '#ef4444', borderRadius: '12px', border: '1px solid #fca5a5', marginBottom: '24px', fontWeight: '600' }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: '16px', background: '#ecfdf5', color: '#10b981', borderRadius: '12px', border: '1px solid #a7f3d0', marginBottom: '24px', fontWeight: '600' }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="contact-form-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>First Name <span style={{ color: '#E71C25' }}>*</span></label>
            <input type="text" name="firstName" required defaultValue={customer?.firstName || ''} readOnly={!!customer} style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', background: customer ? '#f8fafc' : '#fff' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Last Name <span style={{ color: '#E71C25' }}>*</span></label>
            <input type="text" name="lastName" required defaultValue={customer?.lastName || ''} readOnly={!!customer} style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', background: customer ? '#f8fafc' : '#fff' }} />
          </div>
        </div>

        <div className="contact-form-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Email Address <span style={{ color: '#E71C25' }}>*</span></label>
            <input type="email" name="email" required defaultValue={customer?.email || ''} readOnly={!!customer} style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', background: customer ? '#f8fafc' : '#fff' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Phone Number (Optional)</label>
            <input type="tel" name="phone" defaultValue={customer?.phone || ''} style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none' }} />
          </div>
        </div>

        <div className="contact-form-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Message Category <span style={{ color: '#E71C25' }}>*</span></label>
            <select name="category" required style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', background: '#fff' }}>
              <option value="">Select a category...</option>
              <option value="General Question">General Question</option>
              <option value="Order Support">Order Support</option>
              <option value="Payment Support">Payment Support</option>
              <option value="Shipping Question">Shipping Question</option>
              <option value="Return or Refund">Return or Refund</option>
              <option value="Product Question">Product Question</option>
              <option value="Account Support">Account Support</option>
              <option value="Technical Problem">Technical Problem</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Order Number (Optional)</label>
            {customer && orders.length > 0 ? (
              <select name="orderId" style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', background: '#fff' }}>
                <option value="">Select an order...</option>
                {orders.map(o => (
                  <option key={o.orderNumber} value={o.orderNumber}>{o.orderNumber} ({new Date(o.createdAt).toLocaleDateString()})</option>
                ))}
              </select>
            ) : (
              <input type="text" name="orderId" placeholder="e.g. ORD-12345" style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none' }} />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Subject <span style={{ color: '#E71C25' }}>*</span></label>
          <input type="text" name="subject" required placeholder="Brief summary of your inquiry" style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#111111' }}>Message <span style={{ color: '#E71C25' }}>*</span></label>
          </div>
          <textarea name="message" required rows={6} placeholder="How can we help you today?" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', resize: 'vertical' }}></textarea>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
          <input type="checkbox" name="acceptPolicy" required style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#D63062' }} />
          <span style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
            I agree to the <a href="#" style={{ color: '#D63062', fontWeight: '600' }}>Privacy Policy</a> and consent to having this website store my submitted information so they can respond to my inquiry. <span style={{ color: '#E71C25' }}>*</span>
          </span>
        </label>

        <button type="submit" disabled={loading} style={{ 
          background: 'linear-gradient(135deg, #D63062 0%, #730C63 100%)', 
          color: '#fff', 
          padding: '16px 32px', 
          borderRadius: '12px', 
          fontSize: '16px', 
          fontWeight: '800', 
          border: 'none', 
          cursor: 'pointer',
          marginTop: '8px',
          opacity: loading ? 0.7 : 1,
          transition: 'transform 0.2s',
          boxShadow: '0 8px 20px rgba(115,12,99,0.2)'
        }}>
          {loading ? 'Sending Message...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
