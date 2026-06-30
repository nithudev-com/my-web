'use client';

import React, { useState } from 'react';
import { submitReview } from '@/actions/reviews';

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await submitReview({
      productId,
      rating,
      title,
      body,
      author
    });

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '24px', borderRadius: '16px', textAlign: 'center', marginTop: '32px' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#064e3b', marginBottom: '8px' }}>Review Submitted!</h3>
        <p style={{ color: '#047857', fontSize: '14px', margin: 0 }}>Thank you for your feedback. Your review is pending approval and will appear shortly.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '48px', padding: '32px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Write a Review</h3>
      
      {error && (
        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Rating Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Your Rating</label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: star <= rating ? '#f59e0b' : '#cbd5e1', transition: 'color 0.2s' }}
              >
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Author Name */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Your Name</label>
          <input 
            type="text" 
            value={author} 
            onChange={e => setAuthor(e.target.value)}
            required
            placeholder="John Doe"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }}
          />
        </div>

        {/* Review Title */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Review Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="E.g. Fantastic Product!"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }}
          />
        </div>

        {/* Review Body */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Your Review</label>
          <textarea 
            value={body} 
            onChange={e => setBody(e.target.value)}
            required
            rows={4}
            placeholder="Tell us what you liked or disliked about this product..."
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{
            background: '#D63062',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 800,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'background 0.2s',
            alignSelf: 'flex-start'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>

      </form>
    </div>
  );
}
