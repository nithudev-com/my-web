'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendPasswordResetOtp, resetPassword } from './actions';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await sendPasswordResetOtp(email);
    
    if (result.success) {
      setStep(2);
      setSuccess('A verification code has been sent to your email.');
    } else {
      setError(result.error || 'Failed to send verification code.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    formData.append('email', email); // Attach email from step 1
    
    const result = await resetPassword(formData);
    
    if (result.success) {
      setSuccess('Your password has been successfully reset! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setError(result.error || 'Failed to reset password.');
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrapper">
      
      
      <div className="auth-bg-glow"></div>
      <div className="auth-shape-1"></div>
      <div className="auth-shape-2"></div>

      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '48px', height: '48px', 
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-deep))',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '900', fontSize: '24px', letterSpacing: '-1px',
              boxShadow: '0 8px 16px rgba(214, 48, 98, 0.3)'
            }}>
              SC
            </div>
          </div>
          
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--brand-black)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {step === 1 ? 'Reset Password' : 'Create New Password'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
            {step === 1 
              ? "Enter your email address and we'll send you a 6-digit verification code." 
              : "Enter the verification code sent to your email and choose a new password."}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', color: '#ef4444', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', color: '#16a34a', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--brand-black)' }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loading || !email}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                  Sending Code...
                </span>
              ) : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="otp" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--brand-black)' }}>
                6-Digit Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                className="auth-input"
                placeholder="000000"
                style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}
                required
              />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--brand-black)' }}>
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--brand-black)' }}>
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                  Resetting Password...
                </span>
              ) : 'Reset Password'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '-8px' }}
            >
              Did not receive code? Try again
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--muted)' }}>
          Remember your password?{' '}
          <Link href="/login" style={{ color: 'var(--brand-primary)', fontWeight: '700', textDecoration: 'none' }}>
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
