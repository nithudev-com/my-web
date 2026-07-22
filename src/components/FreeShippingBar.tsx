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
