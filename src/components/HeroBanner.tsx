import Link from "next/link";
import Image from "next/image";
import React from "react";

export function HeroBanner() {
  return (
    <div className="sale-hero-container">
      <style>{`
        .sale-hero-container {
          width: 100vw;
          background: linear-gradient(135deg, #cc0000 0%, #660033 40%, #1a0033 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          padding: 60px 24px;
          overflow: hidden;
          position: relative;
          font-family: var(--font-plus-jakarta), sans-serif;
        }

        /* Animated glowing sweeping lines */
        .sale-hero-sweep {
          position: absolute;
          width: 200%;
          height: 100%;
          top: 0;
          left: -50%;
          background: radial-gradient(ellipse at center, rgba(255,50,150,0.15) 0%, transparent 60%);
          transform: rotate(-15deg);
          animation: sweepMotion 8s linear infinite alternate;
          pointer-events: none;
        }

        .sale-hero-sweep-2 {
          position: absolute;
          width: 150%;
          height: 50%;
          bottom: -20%;
          left: -20%;
          background: radial-gradient(ellipse at center, rgba(255,20,80,0.2) 0%, transparent 70%);
          transform: rotate(10deg);
          animation: sweepMotion 12s linear infinite alternate-reverse;
          pointer-events: none;
        }

        @keyframes sweepMotion {
          0% { transform: rotate(-15deg) translateY(0); }
          100% { transform: rotate(-5deg) translateY(-50px); }
        }

        /* Stars/Sparkles */
        .sale-sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px #ff6699;
          animation: twinkle 3s ease-in-out infinite;
        }
        .sale-sparkle-1 { top: 15%; right: 15%; }
        .sale-sparkle-2 { top: 25%; right: 5%; animation-delay: 1s; width: 6px; height: 6px; }
        .sale-sparkle-3 { top: 10%; right: 10%; animation-delay: 2s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .sale-hero-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr;
          align-items: center;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          position: relative;
          z-index: 3;
        }

        @media (max-width: 991px) {
          .sale-hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 30px;
          }
          .sale-header-row {
            justify-content: center;
          }
          .sale-footer-row {
            flex-direction: column;
            justify-content: center;
            gap: 20px !important;
          }
        }

        /* Typography & Layout */
        .sale-content-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sale-header-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .sale-logo-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sale-logo-icon {
          width: 32px;
          height: 32px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        .sale-logo-text {
          font-size: 32px;
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.95);
          letter-spacing: -0.02em;
          font-family: Arial, sans-serif;
        }

        .sale-badge {
          background: linear-gradient(90deg, #ff0055, #cc0033);
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
          padding: 6px 14px;
          transform: rotate(-3deg);
          box-shadow: 2px 4px 15px rgba(255, 0, 85, 0.4);
          letter-spacing: 0.5px;
        }

        .sale-title {
          font-size: clamp(40px, 6vw, 76px);
          font-weight: 900;
          line-height: 1.1;
          color: #ffffff;
          text-shadow: 0 4px 15px rgba(0,0,0,0.4);
          margin: 10px 0;
          letter-spacing: -0.02em;
        }

        .sale-footer-row {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-top: 12px;
        }

        .sale-guarantee {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .sale-star-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #ff3366;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff3366;
          box-shadow: 0 0 10px rgba(255, 51, 102, 0.4);
        }

        .btn-sale-primary {
          background: linear-gradient(180deg, #ff0044, #aa0022);
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          text-decoration: none;
          padding: 14px 40px;
          border-radius: 40px;
          border: 2px solid rgba(255,255,255,0.4);
          box-shadow: 0 8px 25px rgba(255, 0, 68, 0.5), inset 0 2px 4px rgba(255,255,255,0.3);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-sale-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 30px rgba(255, 0, 68, 0.7), inset 0 2px 4px rgba(255,255,255,0.4);
        }

        /* Right Side: Showcase */
        .sale-visual-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .sale-product-img {
          width: 100%;
          max-width: 420px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 30px 40px rgba(0,0,0,0.6));
          animation: floatSlow 6s ease-in-out infinite;
          z-index: 5;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }

        @media (max-width: 991px) {
          .sale-product-img {
            max-width: 320px;
          }
        }
      `}</style>

      {/* Decorative overlays */}
      <div className="sale-hero-sweep" />
      <div className="sale-hero-sweep-2" />
      
      <div className="sale-sparkle sale-sparkle-1"></div>
      <div className="sale-sparkle sale-sparkle-2"></div>
      <div className="sale-sparkle sale-sparkle-3"></div>

      <div className="sale-hero-grid">
        
        {/* Left Side: Typography */}
        <div className="sale-content-box">
          
          <div className="sale-header-row">
            <div className="sale-logo-group">
              <img src="/heart-device.png" alt="Logo" className="sale-logo-icon" />
              <span className="sale-logo-text">SexToys Lovers</span>
            </div>
            <div className="sale-badge">
              JUST LAUNCHED!
            </div>
          </div>

          <h1 className="sale-title">
            Save Up To 90%<br />
            RRP In Our Sample Sale!
          </h1>
          
          <div className="sale-footer-row">
            <div className="sale-guarantee">
              <div className="sale-star-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              New Toys Added Regularly
            </div>
            
            <Link prefetch={true} href="/deals" className="btn-sale-primary">
              Shop The Sale <span style={{fontSize:'26px', lineHeight:0}}>›</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Visual */}
        <div className="sale-visual-container">
          <Image 
            src="/heart-device.png" 
            alt="Premium Vibrator Heart" 
            width={600}
            height={600}
            className="sale-product-img"
            priority={true}
            fetchPriority="high"
            loading="eager"
          />
        </div>

      </div>
    </div>
  );
}
