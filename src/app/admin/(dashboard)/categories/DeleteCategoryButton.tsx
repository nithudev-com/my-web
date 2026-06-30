'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteCategoryButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete category');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to delete category');
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      style={{ 
        color: '#ef4444', 
        background: 'none', 
        border: 'none', 
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        padding: 0,
        font: 'inherit'
      }}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
