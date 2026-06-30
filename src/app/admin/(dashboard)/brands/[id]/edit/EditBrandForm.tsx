'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditBrandForm({ brand }: { brand: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [name, setName] = useState(brand.name || '');
  const [slug, setSlug] = useState(brand.slug || '');
  const [description, setDescription] = useState(brand.seoDescription || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalImageUrl = brand.logo;
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

      const res = await fetch(`/api/brands/${brand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          seoDescription: description,
          logo: finalImageUrl,
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update brand');
      }

      alert('Brand updated successfully!');
      router.push('/admin/brands');
      router.refresh();
      
    } catch (error: any) {
      console.error('Error during submission:', error);
      alert(error.message || 'Error updating brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '32px' }}>Edit Brand: {brand.name}</h1>
      <form onSubmit={handleSubmit} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Brand Name</label>
          <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Update Brand Logo</label>
          {brand.logo && !imageFile && (
            <div style={{ marginBottom: '8px' }}>
              <img src={brand.logo} alt="Current" style={{ height: '100px', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
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
