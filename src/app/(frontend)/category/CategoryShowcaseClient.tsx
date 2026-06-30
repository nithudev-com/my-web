'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface SubCategory {
  id: bigint;
  name: string;
  slug: string;
  image: string | null;
}

interface Category {
  id: bigint;
  name: string;
  slug: string;
  image: string | null;
  children: SubCategory[];
}

export function CategoryShowcaseClient({ categories }: { categories: Category[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on complex layouts

  return (
    <>
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
          grid-auto-flow: dense;
        }

        .bento-card {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 400px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          text-decoration: none;
        }

        /* Hover states for the main card */
        .bento-card:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(214, 48, 98, 0.15);
        }

        .bento-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0.6;
        }

        /* Image scaling on hover */
        .bento-card:hover .bento-bg {
          transform: scale(1.08);
          opacity: 0.8;
        }

        /* Overlay gradient to ensure text readability */
        .bento-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(2,6,23,0.8) 100%);
          transition: opacity 0.5s;
        }

        .bento-card:hover .bento-overlay {
          opacity: 0.6;
        }

        .bento-content {
          position: relative;
          z-index: 2;
          padding: 40px;
          width: 100%;
        }

        .bento-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Subcategories slide up container */
        .bento-subcategories {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 0;
          overflow: hidden;
        }

        .bento-card:hover .bento-subcategories {
          opacity: 1;
          transform: translateY(0);
          max-height: 200px;
        }

        .bento-card:hover .bento-title {
          transform: translateY(-8px);
        }

        .subcategory-pill {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .subcategory-pill:hover {
          background: #D63062;
          border-color: #D63062;
          transform: scale(1.05);
        }

        /* Asymmetrical Grid Sizing */
        .bento-span-8 { grid-column: span 8; }
        .bento-span-4 { grid-column: span 4; }
        .bento-span-6 { grid-column: span 6; }
        .bento-span-12 { grid-column: span 12; }

        @media (max-width: 1024px) {
          .bento-span-8, .bento-span-4 { grid-column: span 6; }
        }

        @media (max-width: 768px) {
          .bento-grid {
            display: flex;
            flex-direction: column;
          }
          .bento-card {
            min-height: 350px;
          }
          .bento-subcategories {
            opacity: 1;
            transform: translateY(0);
            max-height: 200px;
          }
          .bento-title {
            transform: none;
          }
        }
        
        /* Entrance animation */
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fadeUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <div className="bento-grid">
        {categories.map((category, index) => {
          // Dynamic sizing logic for visual interest
          let spanClass = 'bento-span-4';
          if (index % 5 === 0) spanClass = 'bento-span-8'; // Make every 5th item large
          else if (index % 5 === 1 || index % 5 === 2) spanClass = 'bento-span-6'; // Half widths
          else if (categories.length === index + 1 && index % 2 !== 0) spanClass = 'bento-span-12'; // Make last one full if uneven

          return (
            <Link 
              href={`/category/${category.slug}`} 
              key={category.id.toString()} 
              className={`bento-card ${spanClass} animate-fade-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="bento-bg" 
                style={{ 
                  backgroundImage: category.image ? `url(${category.image})` : 'linear-gradient(45deg, #1e293b, #0f172a)' 
                }} 
              />
              <div className="bento-overlay" />
              
              <div className="bento-content">
                <h2 className="bento-title">{category.name}</h2>
                
                {category.children && category.children.length > 0 && (
                  <div className="bento-subcategories">
                    {category.children.map(child => (
                      <object key={child.id.toString()}>
                        {/* Use object to prevent nested <a> tags since the parent is a Link */}
                        <a href={`/category/${child.slug}`} className="subcategory-pill">
                          {child.name}
                        </a>
                      </object>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
