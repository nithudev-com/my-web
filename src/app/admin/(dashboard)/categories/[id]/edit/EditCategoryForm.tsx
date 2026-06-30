'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditCategoryForm({ category, allCategories = [] }: { category: any, allCategories?: { id: string, name: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [name, setName] = useState(category.name || '');
  const [slug, setSlug] = useState(category.slug || '');
  const [description, setDescription] = useState(category.seoDescription || '');
  const [parentId, setParentId] = useState(category.parentId || '');
  const [showOnHome, setShowOnHome] = useState(category.showOnHome || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalImageUrl = category.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Image upload failed');
        const uploadResult = await uploadResponse.json();
        
        const originalUrl = uploadResult.secure_url;
        const urlParts = originalUrl.split('/upload/');
        finalImageUrl = urlParts.length === 2 
          ? `${urlParts[0]}/upload/f_auto,q_auto/${urlParts[1]}` 
          : originalUrl;
      }

      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          seoDescription: description,
          image: finalImageUrl,
          parentId: parentId || null,
          showOnHome,
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update category');
      }

      alert('Category updated successfully!');
      router.push('/admin/categories');
      router.refresh();
      
    } catch (error: any) {
      console.error('Error during submission:', error);
      alert(error.message || 'Error updating category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '32px' }}>Edit Category: {category.name}</h1>
      <form onSubmit={handleSubmit} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category Name</label>
          <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Parent Category</label>
          <select className="input" value={parentId} onChange={e => setParentId(e.target.value)}>
            <option value="">None (Top Level)</option>
            {allCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Update Category Image</label>
          {category.image && !imageFile && (
            <div style={{ marginBottom: '8px' }}>
              <img src={category.image} alt="Current" style={{ height: '100px', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="input" 
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Slug</label>
          <input type="text" className="input" value={slug} onChange={e => setSlug(e.target.value)} required />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            <input type="checkbox" checked={showOnHome} onChange={e => setShowOnHome(e.target.checked)} style={{ width: '18px', height: '18px' }} />
            Show on Home Page
          </label>
          <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
            If checked, this category will appear in the "Shop By Category" grid on the main storefront.
          </small>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description (SEO)</label>
          <textarea className="input" style={{ minHeight: '100px' }} value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="button secondary" disabled={loading}>
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <button type="button" className="button" onClick={() => router.back()} style={{ background: '#e2e8f0', color: '#1e293b' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
