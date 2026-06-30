'use client';

import Link from "next/link";
import React from "react";

export function CategoryGrid({ categories }: { categories: any[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="category-grid-container">
      <div className="container">
        <h2 className="category-grid-heading">Shop By Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="category-box">
              <div className="category-icon-wrapper">
                {category.image && category.image.startsWith('http') ? (
                  <img src={category.image} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  <span className="category-emoji">{category.image || '🏷️'}</span>
                )}
              </div>
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
