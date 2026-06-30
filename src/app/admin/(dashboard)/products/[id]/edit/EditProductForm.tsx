'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // State for fields
  const [title, setTitle] = useState(product.title || '');
  const [sku, setSku] = useState(product.sku || '');
  const [basePrice, setBasePrice] = useState(product.basePrice || '');
  const [description, setDescription] = useState(product.description || '');
  const [videoUrl, setVideoUrl] = useState(product.videoUrl || '');
  const [seoTitle, setSeoTitle] = useState(product.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(product.seoDescription || '');

  // Dynamic States
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>(
    Array.isArray(product.faq) ? product.faq : []
  );
  const [details, setDetails] = useState<{key: string, value: string}[]>(
    Array.isArray(product.details) ? product.details : []
  );

  // Variant States
  const [variantAttributes, setVariantAttributes] = useState<{name: string, options: string}[]>([]);
  const [variants, setVariants] = useState<any[]>(
    Array.isArray(product.variants) ? product.variants : []
  );

  const generateVariants = () => {
    if (variantAttributes.length === 0) return;
    
    // Parse attributes into { name, values: string[] }
    const parsedAttrs = variantAttributes
      .filter(a => a.name.trim() && a.options.trim())
      .map(a => ({
        name: a.name.trim(),
        values: a.options.split(',').map(s => s.trim()).filter(Boolean)
      }));
      
    if (parsedAttrs.length === 0) return;

    // Cartesian product to generate combinations
    const combine = (attrs: any[], idx: number = 0, current: any = {}): any[] => {
      if (idx === attrs.length) return [current];
      const attr = attrs[idx];
      let results: any[] = [];
      for (const val of attr.values) {
        results = results.concat(combine(attrs, idx + 1, { ...current, [attr.name]: val }));
      }
      return results;
    };

    const combinations = combine(parsedAttrs);
    
    // Create new variants array, trying to map over existing ones to keep SKUs/prices if attributes match
    const newVariants = combinations.map(combo => {
      // Find if we already have this variant combination
      const existing = variants.find(v => {
        if (!v.attributes) return false;
        return Object.entries(combo).every(([k, val]) => v.attributes[k] === val);
      });
      
      const variantNameStr = Object.values(combo).join('-');
      
      return {
        sku: existing?.sku || `${sku}-${variantNameStr}`.toUpperCase(),
        price: existing?.price || basePrice || '',
        salePrice: existing?.salePrice || '',
        stockQuantity: existing?.stockQuantity || 0,
        attributes: combo
      };
    });
    
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const uploadVariantImage = async (index: number, file: File | null) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) throw new Error('Image upload failed');
      const uploadResult = await uploadResponse.json();
      
      const originalUrl = uploadResult.secure_url;
      const urlParts = originalUrl.split('/upload/');
      const finalImageUrl = urlParts.length === 2 
        ? `${urlParts[0]}/upload/c_thumb,w_200,h_200/${urlParts[1]}` 
        : originalUrl;
        
      updateVariant(index, 'image', finalImageUrl);
    } catch (error) {
      console.error(error);
      alert('Failed to upload variant image.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalImageUrl = product.mainImage; // Default to existing image
      
      // Upload NEW image to Cloudinary if one is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
        
        const uploadResult = await uploadResponse.json();
        
        const originalUrl = uploadResult.secure_url;
        const urlParts = originalUrl.split('/upload/');
        
        if (urlParts.length === 2) {
          finalImageUrl = `${urlParts[0]}/upload/f_auto,q_auto/${urlParts[1]}`;
        } else {
          finalImageUrl = originalUrl;
        }
      }
      
      // Call PUT API to update the product
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          sku,
          basePrice: Number(basePrice),
          description,
          seoTitle,
          seoDescription,
          faq: faqs,
          details: details,
          mainImage: finalImageUrl,
          videoUrl,
          variants: variants,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update product');
      }

      alert('Product updated successfully!');
      router.push('/admin/products');
      router.refresh();
      
    } catch (error) {
      console.error('Error during submission:', error);
      alert('Error updating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: 'question'|'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const addDetail = () => setDetails([...details, { key: '', value: '' }]);
  const removeDetail = (index: number) => setDetails(details.filter((_, i) => i !== index));
  const updateDetail = (index: number, field: 'key'|'value', value: string) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  return (
    <div style={{ maxWidth: '800px', paddingBottom: '60px' }}>
      <h1 style={{ marginBottom: '32px' }}>Edit Product: {product.title}</h1>
      <form onSubmit={handleSubmit} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
          <input type="text" className="input" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Update Product Image</label>
          {product.mainImage && !imageFile && (
            <div style={{ marginBottom: '8px' }}>
              <img src={product.mainImage} alt="Current" style={{ height: '100px', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
              <div style={{ fontSize: '12px', color: '#64748b' }}>Current Image</div>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="input" 
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
            Leave blank to keep existing image. New images will be optimized via Cloudinary.
          </small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Video URL</label>
          <input type="text" className="input" placeholder="e.g. YouTube, Vimeo, or MP4 link" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>SKU</label>
            <input type="text" className="input" value={sku} onChange={e => setSku(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Base Price</label>
            <input type="number" step="0.01" className="input" value={basePrice} onChange={e => setBasePrice(e.target.value)} required />
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
          <textarea className="input" style={{ minHeight: '120px' }} value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>

        {/* SEO SECTION */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>SEO Metadata</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>SEO Title</label>
              <input type="text" className="input" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>SEO Description</label>
              <textarea className="input" style={{ minHeight: '80px' }} value={seoDescription} onChange={e => setSeoDescription(e.target.value)}></textarea>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS SECTION */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Product Details</h3>
            <button type="button" className="button" onClick={addDetail} style={{ padding: '4px 12px', fontSize: '14px' }}>+ Add Detail</button>
          </div>
          {details.map((detail, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px', marginBottom: '12px' }}>
              <input type="text" className="input" placeholder="Name (e.g. Color)" value={detail.key} onChange={(e) => updateDetail(index, 'key', e.target.value)} required />
              <input type="text" className="input" placeholder="Value (e.g. Red)" value={detail.value} onChange={(e) => updateDetail(index, 'value', e.target.value)} required />
              <button type="button" className="button" onClick={() => removeDetail(index)} style={{ background: '#fee2e2', color: '#b91c1c' }}>Remove</button>
            </div>
          ))}
          {details.length === 0 && <p style={{ color: '#64748b', fontSize: '14px' }}>No details added.</p>}
        </div>

        {/* FAQ SECTION */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Frequently Asked Questions</h3>
            <button type="button" className="button" onClick={addFaq} style={{ padding: '4px 12px', fontSize: '14px' }}>+ Add FAQ</button>
          </div>
          {faqs.map((faq, index) => (
            <div key={index} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '16px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <button type="button" className="button" onClick={() => removeFaq(index)} style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 8px', fontSize: '12px' }}>Remove</button>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Question</label>
                <input type="text" className="input" placeholder="e.g. Is this waterproof?" value={faq.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Answer</label>
                <textarea className="input" style={{ minHeight: '60px' }} value={faq.answer} onChange={(e) => updateFaq(index, 'answer', e.target.value)} required></textarea>
              </div>
            </div>
          ))}
          {faqs.length === 0 && <p style={{ color: '#64748b', fontSize: '14px' }}>No FAQs added.</p>}
        </div>

        {/* VARIANT BUILDER SECTION */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0' }}>Variable Product Setup</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Define attributes to auto-generate product variants.</p>
            </div>
            <button type="button" className="button" onClick={() => setVariantAttributes([...variantAttributes, {name: '', options: ''}])} style={{ padding: '4px 12px', fontSize: '14px' }}>+ Add Attribute</button>
          </div>
          
          {variantAttributes.map((attr, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px', marginBottom: '12px' }}>
              <input type="text" className="input" placeholder="e.g. Size" value={attr.name} onChange={(e) => {
                const newAttrs = [...variantAttributes]; newAttrs[index].name = e.target.value; setVariantAttributes(newAttrs);
              }} />
              <input type="text" className="input" placeholder="e.g. Small, Medium, Large (comma separated)" value={attr.options} onChange={(e) => {
                const newAttrs = [...variantAttributes]; newAttrs[index].options = e.target.value; setVariantAttributes(newAttrs);
              }} />
              <button type="button" className="button" onClick={() => setVariantAttributes(variantAttributes.filter((_, i) => i !== index))} style={{ background: '#fee2e2', color: '#b91c1c' }}>Remove</button>
            </div>
          ))}

          {variantAttributes.length > 0 && (
            <div style={{ marginTop: '16px', marginBottom: '24px' }}>
              <button type="button" className="button secondary" onClick={generateVariants} style={{ background: '#1e293b' }}>⚡ Generate Combinations</button>
            </div>
          )}

          {variants.length > 0 && (
            <div style={{ overflowX: 'auto', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', width: '60px' }}>Image</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Variant</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Hex Color</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>SKU</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Price</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Sale Price</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Stock</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => {
                    // Check if this variant has a color attribute to show the hex picker
                    const colorAttrKey = Object.keys(v.attributes || {}).find(k => k.toLowerCase().includes('color') || k.toLowerCase().includes('colore'));
                    
                    return (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                      <td style={{ padding: '8px' }}>
                        <div style={{ position: 'relative', width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                          {v.image ? (
                            <img src={v.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Variant" />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '10px', color: '#94a3b8' }}>No Img</div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => uploadVariantImage(i, e.target.files?.[0] || null)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} title="Upload Image" />
                        </div>
                      </td>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{Object.values(v.attributes || {}).join(' / ')}</td>
                      <td style={{ padding: '8px' }}>
                        {colorAttrKey ? (
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <input type="color" value={v.attributes[`${colorAttrKey}Hex`] || '#000000'} onChange={e => {
                               const newAttrs = {...v.attributes, [`${colorAttrKey}Hex`]: e.target.value};
                               updateVariant(i, 'attributes', newAttrs);
                             }} style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                           </div>
                        ) : <span style={{color: '#94a3b8'}}>N/A</span>}
                      </td>
                      <td style={{ padding: '8px' }}><input type="text" className="input" style={{ width: '100%', padding: '6px' }} value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)} required /></td>
                      <td style={{ padding: '8px' }}><input type="number" step="0.01" className="input" style={{ width: '80px', padding: '6px' }} value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} required /></td>
                      <td style={{ padding: '8px' }}><input type="number" step="0.01" className="input" style={{ width: '80px', padding: '6px' }} value={v.salePrice} onChange={e => updateVariant(i, 'salePrice', e.target.value)} /></td>
                      <td style={{ padding: '8px' }}><input type="number" className="input" style={{ width: '60px', padding: '6px' }} value={v.stockQuantity} onChange={e => updateVariant(i, 'stockQuantity', e.target.value)} required /></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} style={{ background: '#fee2e2', padding: '6px 12px', borderRadius: '4px', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>X</button></td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
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
