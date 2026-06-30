'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCategoryForm({ allCategories = [] }: { allCategories?: { id: string, name: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Extract form values synchronously before any async operations
    const formElements = e.currentTarget.elements as any;
    const formValues = {
      name: formElements.name.value,
      slug: formElements.slug.value,
      description: formElements.description.value,
      parentId: formElements.parentId.value,
      showOnHome: formElements.showOnHome.checked
    };

    try {
      let finalImageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Image upload failed');
        const uploadResult = await uploadResponse.json();
        
        // Auto-optimize via Cloudinary
        const originalUrl = uploadResult.secure_url;
        const urlParts = originalUrl.split('/upload/');
        finalImageUrl = urlParts.length === 2 
          ? `${urlParts[0]}/upload/f_auto,q_auto/${urlParts[1]}` 
          : originalUrl;
      }

      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formValues.name,
          slug: formValues.slug,
          seoDescription: formValues.description,
          image: finalImageUrl,
          parentId: formValues.parentId || null,
          showOnHome: formValues.showOnHome,
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create category');
      }

      alert('Category saved successfully!');
      router.push('/admin/categories');
      router.refresh();
      
    } catch (error: any) {
      console.error('Error during submission:', error);
      alert(error.message || 'Error saving category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '32px' }}>Add New Category</h1>
      <form onSubmit={handleSubmit} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category Name</label>
          <input type="text" name="name" className="input" required />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Parent Category</label>
          <select name="parentId" className="input">
            <option value="">None (Top Level)</option>
            {allCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category Image</label>
          <input 
            type="file" 
            accept="image/*" 
            className="input" 
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
            Image will be automatically optimized via Cloudinary
          </small>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Slug</label>
          <input type="text" name="slug" className="input" placeholder="leave blank to auto-generate" />
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            <input type="checkbox" name="showOnHome" style={{ width: '18px', height: '18px' }} />
            Show on Home Page
          </label>
          <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
            If checked, this category will appear in the "Shop By Category" grid on the main storefront.
          </small>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description (SEO)</label>
          <textarea name="description" className="input" style={{ minHeight: '100px' }}></textarea>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="button secondary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Category'}
          </button>
          <button type="button" className="button" onClick={() => router.back()} style={{ background: '#e2e8f0', color: '#1e293b' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
