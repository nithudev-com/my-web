'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface MegaMenuProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ categories, isOpen, onClose }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // When menu opens, default to the first category if none is active
  useEffect(() => {
    if (isOpen && !activeCategory && categories && categories.length > 0) {
      setActiveCategory(categories[0].id);
    }
  }, [isOpen, categories, activeCategory]);

  if (!isOpen) return null;

  const activeCatData = categories.find((c) => c.id === activeCategory);

  return (
    <>
      <div className="mega-menu-overlay" onClick={onClose} />
      <div className="mega-menu-container">
        <div className="mega-menu-sidebar">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`mega-menu-sidebar-item ${activeCategory === cat.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveCategory(cat.id)}
            >
              <Link href={`/category/${cat.slug}`} onClick={onClose}>
                {cat.name}
              </Link>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          ))}
        </div>
        <div className="mega-menu-content">
          {activeCatData?.children && activeCatData.children.length > 0 ? (
            <div className="mega-menu-grid">
              {activeCatData.children.map((subCat) => (
                <div key={subCat.id} className="mega-menu-subcat-group">
                  <Link href={`/category/${subCat.slug}`} className="mega-menu-subcat-title" onClick={onClose}>
                    {subCat.name}
                  </Link>
                  {subCat.children && subCat.children.length > 0 && (
                    <div className="mega-menu-child-links">
                      {subCat.children.map((child) => (
                        <Link key={child.id} href={`/category/${child.slug}`} className="mega-menu-child-link" onClick={onClose}>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mega-menu-empty">
              No subcategories available.
              <br />
              <Link href={`/category/${activeCatData?.slug}`} className="mega-menu-shop-all" onClick={onClose}>
                Shop All {activeCatData?.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
