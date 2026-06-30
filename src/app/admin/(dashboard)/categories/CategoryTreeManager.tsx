'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteCategoryButton from './DeleteCategoryButton';
import ToggleHomeCategoryButton from './ToggleHomeCategoryButton';

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  showOnHome: boolean;
  _count: { products: number };
}

interface DropIndicator {
  id: string;
  position: 'before' | 'after' | 'inside';
}

export default function CategoryTreeManager({ initialCategories }: { initialCategories: CategoryData[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  // Recursively build tree
  const buildTree = (parentId: string | null = null, depth = 0): (CategoryData & { depth: number })[] => {
    return categories
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .flatMap((c) => [{ ...c, depth }, ...buildTree(c.id, depth + 1)]);
  };

  const tree = buildTree();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // e.dataTransfer.setDragImage(...) // could set a custom drag image
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    // Prevent dropping a parent into its own child!
    let current = categories.find((c) => c.id === targetId);
    while (current?.parentId) {
      if (current.parentId === draggedId) return; // invalid drop
      current = categories.find((c) => c.id === current!.parentId);
    }

    const row = rowRefs.current[targetId];
    if (!row) return;

    const rect = row.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    let position: 'before' | 'after' | 'inside' = 'inside';
    
    if (y < rect.height * 0.25) {
      position = 'before';
    } else if (y > rect.height * 0.75) {
      position = 'after';
    }

    setDropIndicator({ id: targetId, position });
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || !dropIndicator) return;

    const targetCategory = categories.find((c) => c.id === dropIndicator.id);
    const draggedCategory = categories.find((c) => c.id === draggedId);
    if (!targetCategory || !draggedCategory) return;

    let newParentId = targetCategory.parentId;
    let newSortOrder = targetCategory.sortOrder;

    if (dropIndicator.position === 'inside') {
      newParentId = targetCategory.id;
      const children = categories.filter((c) => c.parentId === targetCategory.id);
      newSortOrder = children.length > 0 ? Math.max(...children.map(c => c.sortOrder)) + 1 : 0;
    } else {
      // Adjusting sortOrder for before/after
      const siblings = categories
        .filter((c) => c.parentId === targetCategory.parentId && c.id !== draggedId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      
      const targetIndex = siblings.findIndex((c) => c.id === targetCategory.id);
      
      // We will recalculate all sortOrders for this parent's children
      const updatedSiblings = [...siblings];
      if (dropIndicator.position === 'before') {
        updatedSiblings.splice(targetIndex, 0, draggedCategory);
      } else {
        updatedSiblings.splice(targetIndex + 1, 0, draggedCategory);
      }

      const newCategories = categories.map((c) => {
        if (c.id === draggedId) {
          return { ...c, parentId: newParentId };
        }
        return c;
      });

      // Assign sequential sortOrders to all siblings
      updatedSiblings.forEach((sibling, index) => {
        const cat = newCategories.find(c => c.id === sibling.id);
        if (cat) cat.sortOrder = index;
      });

      setCategories(newCategories);
      setDropIndicator(null);
      setDraggedId(null);
      return; // Handled sibling insert
    }

    // Inside drop handler
    const newCategories = categories.map((c) => {
      if (c.id === draggedId) {
        return { ...c, parentId: newParentId, sortOrder: newSortOrder };
      }
      return c;
    });

    setCategories(newCategories);
    setDropIndicator(null);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDropIndicator(null);
    setDraggedId(null);
  };

  const saveHierarchy = async () => {
    setIsSaving(true);
    try {
      const payload = categories.map((c) => ({
        id: c.id,
        parentId: c.parentId,
        sortOrder: c.sortOrder,
      }));

      const res = await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });

      if (!res.ok) throw new Error('Failed to save');
      alert('Categories hierarchy saved successfully!');
      router.refresh();
    } catch (err) {
      alert('Error saving categories');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Categories</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={saveHierarchy} disabled={isSaving} className="button" style={{ background: '#10b981' }}>
            {isSaving ? 'Saving...' : 'Save Hierarchy'}
          </button>
          <Link href="/admin/categories/new" className="button secondary">Add Category</Link>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
          Drag and drop rows to reorder them or nest them inside each other. 
          Hovering the top/bottom edges of a row places it before/after. Hovering the center nests it inside.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', userSelect: 'none' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 0' }}>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tree.map((c) => {
              const isDragged = draggedId === c.id;
              const isDropTarget = dropIndicator?.id === c.id;
              
              let rowStyle: React.CSSProperties = {
                borderBottom: '1px solid var(--border)',
                opacity: isDragged ? 0.5 : 1,
                cursor: 'grab',
                position: 'relative',
              };

              // Visual indicator styles
              if (isDropTarget) {
                if (dropIndicator.position === 'inside') {
                  rowStyle.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                } else if (dropIndicator.position === 'before') {
                  rowStyle.boxShadow = 'inset 0 2px 0 0 #3b82f6';
                } else if (dropIndicator.position === 'after') {
                  rowStyle.boxShadow = 'inset 0 -2px 0 0 #3b82f6';
                }
              }

              return (
                <tr
                  key={c.id}
                  ref={(el) => { rowRefs.current[c.id] = el; }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, c.id)}
                  onDragOver={(e) => handleDragOver(e, c.id)}
                  onDrop={(e) => handleDrop(e, c.id)}
                  onDragEnd={handleDragEnd}
                  style={rowStyle}
                >
                  <td style={{ padding: '12px 0', paddingLeft: `${c.depth * 32}px` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--muted)', cursor: 'grab' }}>☰</span>
                      <span style={{ fontWeight: c.depth === 0 ? 'bold' : 'normal' }}>
                        {c.name}
                      </span>
                      <ToggleHomeCategoryButton id={c.id} initialState={c.showOnHome} />
                    </div>
                  </td>
                  <td>{c.slug}</td>
                  <td>{c._count.products}</td>
                  <td>
                    <Link href={`/admin/categories/${c.id}/edit`} style={{ color: 'var(--accent)', marginRight: '12px' }}>Edit</Link>
                    <DeleteCategoryButton id={c.id} />
                  </td>
                </tr>
              );
            })}
            
            {tree.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)' }}>
                  No categories found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
