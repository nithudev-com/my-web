'use client';

import { useState } from 'react';
import { updateSecurity } from '../actions';

export function SecurityForm({ currentEmail }: { currentEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [passwordInput, setPasswordInput] = useState('');

  // Very basic entropy calculation for UI
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 8) score += 25;
    if (pass.length > 12) score += 25;
    if (/[A-Z]/.test(pass)) score += 15;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return Math.min(100, score);
  };

  const strength = calculateStrength(passwordInput);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const result = await updateSecurity(formData);

    if (result.success) {
      setMsg({ type: 'success', text: result.message || 'Security settings updated!' });
      if (formData.get('newPassword')) {
        (e.target as HTMLFormElement).reset();
        setPasswordInput('');
      }
    } else {
      setMsg({ type: 'error', text: result.error || 'Error updating security settings.' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', color: '#111111' }}>Authorization Required</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Current Password <span style={{ color: '#ef4444' }}>*</span></label>
          <input 
            type="password" 
            name="currentPassword" 
            required
            placeholder="Enter your current password to allow changes"
            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#111111'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Email Address</label>
        <input 
          type="email" 
          name="email" 
          defaultValue={currentEmail} 
          required 
          style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #F0DDE5', fontSize: '15px', outline: 'none' }} 
          onFocus={(e) => e.currentTarget.style.borderColor = '#D63062'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#F0DDE5'}
        />
      </div>

      <div style={{ borderTop: '1px solid #F0DDE5', margin: '8px 0' }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#111111' }}>Change Password (Optional)</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>New Password</label>
          <input 
            type="password" 
            name="newPassword" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #F0DDE5', fontSize: '15px', outline: 'none' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#D63062'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#F0DDE5'}
          />
          {passwordInput && (
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: '#64748b' }}>
                <span>Password Strength</span>
                <span style={{ color: strength < 50 ? '#ef4444' : strength < 80 ? '#f59e0b' : '#10b981' }}>
                  {strength < 50 ? 'Weak' : strength < 80 ? 'Good' : 'Strong'}
                </span>
              </div>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: strength + "%", 
                  background: strength < 50 ? '#ef4444' : strength < 80 ? '#f59e0b' : '#10b981',
                  transition: '0.3s'
                }}></div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Confirm New Password</label>
          <input 
            type="password" 
            name="confirmNewPassword" 
            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #F0DDE5', fontSize: '15px', outline: 'none' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#D63062'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#F0DDE5'}
          />
        </div>
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
          {loading ? 'Authenticating...' : 'Update Security Settings'}
        </button>
      </div>
    </form>
  );
}
