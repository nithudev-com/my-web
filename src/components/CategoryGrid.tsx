'use client';

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { shopifyLoader } from "@/lib/image-loader";

const ACCENT_COLORS = [
  '#f43f5e', // Pink/Red
  '#84cc16', // Lime Green
  '#ec4899', // Pink
  '#f59e0b', // Yellow/Orange
  '#10b981', // Green
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#0ea5e9', // Blue
];

export function CategoryGrid({ categories }: { categories: any[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="category-showcase-section">
      <div className="container">
        <div className="category-showcase-wrapper">
          <h2 className="category-showcase-title">Shop by Category</h2>
          <div className="category-showcase-grid">
            {categories.map((category, index) => {
              const circleColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
              return (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`} 
                  prefetch={true}
                  className="category-showcase-card"
                >
                  <span className="category-showcase-name">{category.name}</span>
                  
                  <div className="category-showcase-backdrop-wrapper">
                    <div 
                      className="category-showcase-circle" 
                      style={{ backgroundColor: circleColor }}
                    />
                    <div className="category-showcase-img-container">
                      {category.image ? (
                        <Image 
                          src={category.image} 
                          alt={category.seoTitle || category.name} 
                          className="category-showcase-img"
                          fill
                          sizes="100px"
                          style={{ objectFit: "contain", mixBlendMode: "multiply" }}
                         loader={shopifyLoader} />
                      ) : (
                        <span className="category-showcase-placeholder">
                          🏷️
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="category-showcase-footer">
            <Link href="/category" className="category-showcase-explore">
              Explore More
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .category-showcase-section {
          padding: 16px 0 40px 0;
          background: #ffffff;
        }

        .category-showcase-wrapper {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          padding-top: 24px;
          padding-bottom: 8px;
        }

        .category-showcase-title {
          font-size: 22px;
          font-weight: 800;
          color: #4c1d95; /* Deep Purple */
          text-align: center;
          margin-bottom: 20px;
          margin-top: 0;
        }

        .category-showcase-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3px; /* Creates the white lines */
          background: #ffffff;
        }

        @media (max-width: 1024px) {
          .category-showcase-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .category-showcase-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 3px;
            background: #ffffff;
          }
          
          .category-showcase-card {
            height: 100px !important;
            padding: 0 0 0 16px !important;
          }
          
          .category-showcase-name {
            font-size: 14px !important;
            max-width: 50% !important;
          }

          .category-showcase-backdrop-wrapper {
            width: 70px !important;
          }

          .category-showcase-circle {
            width: 90px !important;
            height: 90px !important;
            right: -25px !important;
          }

          .category-showcase-img-container {
            width: 50px !important;
            height: 50px !important;
            right: 0 !important;
          }
        }

        .category-showcase-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f4f4f5; /* Light gray cell background */
          height: 120px;
          padding: 0 0 0 24px;
          position: relative;
          text-decoration: none;
          overflow: hidden;
          transition: background 0.2s ease;
        }

        .category-showcase-card:hover {
          background: #e4e4e7;
        }

        .category-showcase-name {
          font-size: 16px;
          font-weight: 800;
          color: #18181b; /* Dark text */
          z-index: 2;
          max-width: 50%;
          line-height: 1.2;
        }

        .category-showcase-backdrop-wrapper {
          position: relative;
          height: 100%;
          width: 100px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-shrink: 0;
          z-index: 2;
        }

        .category-showcase-circle {
          position: absolute;
          right: -30px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          z-index: 1;
        }

        .category-showcase-img-container {
          position: relative;
          width: 60px;
          height: 60px;
          z-index: 2;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-showcase-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }

        .category-showcase-placeholder {
          font-size: 32px;
        }

        .category-showcase-footer {
          text-align: center;
          padding: 24px 0 12px 0;
          background: #ffffff;
        }

        .category-showcase-explore {
          font-size: 16px;
          font-weight: 800;
          color: #4c1d95;
          text-decoration: none;
        }
        
        .category-showcase-explore:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
