'use client';

import React, { useState } from 'react';
import { approveReview, deleteReview } from '@/actions/reviews';

export function ReviewList({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    const res = await approveReview(id, !currentStatus);
    if (res.success) {
      setReviews(reviews.map(r => r.id.toString() === id ? { ...r, approved: !currentStatus } : r));
    } else {
      alert(res.error);
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setLoadingId(id);
    const res = await deleteReview(id);
    if (res.success) {
      setReviews(reviews.filter(r => r.id.toString() !== id));
    } else {
      alert(res.error);
    }
    setLoadingId(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="card" style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
        No reviews found.
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '14px' }}>
            <th style={{ padding: '12px', fontWeight: 600 }}>Date</th>
            <th style={{ padding: '12px', fontWeight: 600 }}>Product</th>
            <th style={{ padding: '12px', fontWeight: 600 }}>Author</th>
            <th style={{ padding: '12px', fontWeight: 600 }}>Rating</th>
            <th style={{ padding: '12px', fontWeight: 600 }}>Content</th>
            <th style={{ padding: '12px', fontWeight: 600 }}>Status</th>
            <th style={{ padding: '12px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <tr key={review.id.toString()} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '16px 12px', fontSize: '14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                {review.product?.title || 'Unknown Product'}
              </td>
              <td style={{ padding: '16px 12px', fontSize: '14px', color: '#0f172a' }}>
                {review.author}
              </td>
              <td style={{ padding: '16px 12px', color: '#f59e0b' }}>
                <div style={{ display: 'flex' }}>
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} width="16" height="16" fill={star <= review.rating ? 'currentColor' : '#cbd5e1'} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
              </td>
              <td style={{ padding: '16px 12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{review.title}</div>
                <div style={{ fontSize: '13px', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{review.body}</div>
              </td>
              <td style={{ padding: '16px 12px' }}>
                <span style={{ 
                  display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                  background: review.approved ? '#ecfdf5' : '#fef3c7', 
                  color: review.approved ? '#059669' : '#d97706' 
                }}>
                  {review.approved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', opacity: loadingId === review.id.toString() ? 0.5 : 1, pointerEvents: loadingId === review.id.toString() ? 'none' : 'auto' }}>
                  <button 
                    onClick={() => handleToggleApprove(review.id.toString(), review.approved)}
                    style={{ background: review.approved ? '#f1f5f9' : '#10b981', color: review.approved ? '#64748b' : 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {review.approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => handleDelete(review.id.toString())}
                    style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
