'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
    alt: "Premium Headphones"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop",
    alt: "Luxury Smartphone"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop",
    alt: "Smart Watch"
  }
];

export function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modern-hero-container">
      <div className="modern-hero-grid">
        
        {/* Left Side: Typography */}
        <div className="modern-hero-content">
          <div className="modern-badge fade-up-1">NEW ARRIVALS 2026</div>
          <h1 className="modern-hero-title fade-up-2">
            Experience the<br />
            <span className="modern-gradient-text">Speed of Commerce</span>
          </h1>
          <p className="modern-hero-desc fade-up-3">
            Shop the world's most premium brands with lightning-fast delivery and immersive shopping experiences.
          </p>
          
          <div className="modern-hero-actions fade-up-4">
            <Link href="/category/electronics" className="modern-btn-primary">
              Shop Collection
            </Link>
            <Link href="/category/fashion" className="modern-btn-secondary">
              View Trends
            </Link>
          </div>
        </div>

        {/* Right Side: Floating Image Slider */}
        <div className="modern-hero-visual fade-up-3">
          <div className="modern-hero-blob"></div>
          
          <div className="slider-wrapper">
            {SLIDES.map((slide, index) => {
              let slideClass = "slider-image";
              if (index === activeIndex) {
                slideClass += " active";
              } else if (index === (activeIndex - 1 + SLIDES.length) % SLIDES.length) {
                slideClass += " prev";
              } else {
                slideClass += " next";
              }

              return (
                <img 
                  key={slide.id}
                  src={slide.image} 
                  alt={slide.alt} 
                  className={slideClass}
                />
              );
            })}
          </div>

          {/* Navigation Dots */}
          <div className="slider-dots">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
