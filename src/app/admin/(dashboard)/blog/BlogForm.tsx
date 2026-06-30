'use client';

import { createBlogPost, updateBlogPost } from '@/actions/blog';
import { useTransition, useState } from 'react';

export function BlogForm({ post }: { post?: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        if (post?.id) {
          await updateBlogPost(BigInt(post.id), formData);
        } else {
          await createBlogPost(formData);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px' }}>{error}</div>}
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#475569' }}>Title</label>
          <input name="title" defaultValue={post?.title} required className="dashboard-input" placeholder="e.g. 5 Trends in Ecommerce" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#475569' }}>URL Slug</label>
          <input name="slug" defaultValue={post?.slug} required className="dashboard-input" placeholder="e.g. 5-trends-in-ecommerce" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#475569' }}>Cover Image URL (Optional)</label>
        <input name="coverImage" defaultValue={post?.coverImage} className="dashboard-input" placeholder="https://..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#475569' }}>Excerpt (Short Description)</label>
        <textarea name="excerpt" defaultValue={post?.excerpt} className="dashboard-input" rows={2} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#475569' }}>Content (HTML/Text)</label>
        <textarea name="content" defaultValue={post?.content} required className="dashboard-input" rows={15} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'monospace' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input type="checkbox" name="isPublished" value="true" defaultChecked={post?.isPublished} id="isPublished" style={{ width: '18px', height: '18px' }} />
        <label htmlFor="isPublished" style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Publish instantly?</label>
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" disabled={isPending} className="dashboard-btn-primary" style={{ background: '#111111', color: '#fff', border: 'none', padding: '12px 32px', fontSize: '15px' }}>
          {isPending ? 'Saving...' : (post?.id ? 'Update Post' : 'Create Post')}
        </button>
      </div>
    </form>
  );
}
