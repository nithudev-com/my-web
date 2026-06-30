'use client';

import { useState } from 'react';
import { guestReplyMessage } from '../../../actions';

export function GuestReplyForm({ conversationId, guestToken }: { conversationId: string, guestToken: string }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    formData.append('conversationId', conversationId);
    formData.append('guestToken', guestToken);
    
    const result = await guestReplyMessage(formData);

    if (result.success) {
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(result.error || 'Failed to send reply');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '800', color: '#111111' }}>Send a Reply</h3>
      
      {errorMsg && (
        <div style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', border: '1px solid #fca5a5', fontSize: '14px', fontWeight: '600' }}>
          {errorMsg}
        </div>
      )}

      <textarea name="message" required rows={4} placeholder="Type your message here..." style={{ padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', resize: 'vertical' }}></textarea>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" disabled={loading} style={{ 
          background: 'linear-gradient(135deg, #D63062 0%, #730C63 100%)', 
          color: '#fff', padding: '10px 24px', borderRadius: '10px', fontWeight: '700', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 
        }}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
