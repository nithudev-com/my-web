import React, { useEffect, useState } from 'react';

interface FreeShippingBarProps {
  subtotal: number;
  threshold?: number;
}

export function FreeShippingBar({ subtotal, threshold = 100 }: FreeShippingBarProps) {
  const [mounted, setMounted] = useState(false);
  
  // To avoid hydration mismatch if initial render differs
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="free-shipping-container" style={{ opacity: 0 }}></div>;
  }

  const percentage = Math.min(100, Math.max(0, (subtotal / threshold) * 100));
  const isUnlocked = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .free-shipping-container {
          padding: 16px;
          background: linear-gradient(to bottom, #ffffff, #f8fafc);
          border-bottom: 1px solid #e2e8f0;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          margin-bottom: 8px;
        }
        .free-shipping-text {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: center;
        }
        .free-shipping-text span { flex-grow: 1; }
        .free-shipping-text strong { color: #10b981; }
        .free-shipping-text.unlocked { color: #059669; animation: pulse-text 1.5s infinite alternate; }
        .progress-bar-bg { width: 100%; height: 10px; background-color: #e2e8f0; border-radius: 9999px; position: relative; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); background-size: 200% 100%; border-radius: 9999px; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; animation: gradient-shift 3s ease infinite; }
        .progress-bar-fill::after { content: ""; position: absolute; inset: 0; background: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent); background-size: 20px 20px; animation: move-stripes 1s linear infinite; border-radius: 9999px; }
        .progress-bar-fill.unlocked { background: linear-gradient(90deg, #10b981, #34d399); box-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3); animation: unlocked-pulse 2s infinite; }
        .progress-bar-fill.unlocked::after { display: none; }
        .truck-icon { position: absolute; top: -14px; width: 24px; height: 24px; color: #3b82f6; transition: left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); transform: translateX(-50%); z-index: 10; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2)); }
        .truck-icon.unlocked { color: #10b981; animation: bounce 1s infinite; }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes move-stripes { 0% { background-position: 0 0; } 100% { background-position: 20px 0; } }
        @keyframes pulse-text { 0% { transform: scale(1); } 100% { transform: scale(1.03); } }
        @keyframes unlocked-pulse { 0% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); } 50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); } 100% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-5px); } }
      `}} />
      <div className="free-shipping-container">
      <div className={`free-shipping-text ${isUnlocked ? 'unlocked' : ''}`}>
        {isUnlocked ? (
          <span>🎉 <strong>You've unlocked FREE shipping!</strong></span>
        ) : subtotal === 0 ? (
          <span>Add <strong>${threshold.toFixed(2)}</strong> to cart for free shipping!</span>
        ) : (
          <span>You're only <strong>${remaining.toFixed(2)}</strong> away from free shipping!</span>
        )}
      </div>
      
      <div className="progress-bar-bg">
        <div 
          className={`progress-bar-fill ${isUnlocked ? 'unlocked' : ''}`}
          style={{ width: `${percentage}%` }}
        />
        <div 
          className={`truck-icon ${isUnlocked ? 'unlocked' : ''}`}
          style={{ left: `${percentage}%` }}
        >
          {/* Truck SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      </div>
    </div>
    </>
  );
}
