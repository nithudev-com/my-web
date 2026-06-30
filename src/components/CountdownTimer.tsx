'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string | Date | null;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = null;

      if (difference > 0) {
        timeLeft = {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
          minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
          seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
        };
      }

      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient || !targetDate) {
    return null; // Do not render on server to avoid hydration mismatch, or if no target date exists
  }

  if (!timeLeft) {
    return (
      <div style={{ background: '#fff', color: '#0f172a', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#D63062' }}>Deal Expired</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
      {[
        { label: 'Hours', val: timeLeft.hours },
        { label: 'Minutes', val: timeLeft.minutes },
        { label: 'Seconds', val: timeLeft.seconds }
      ].map(time => (
        <div key={time.label} style={{ background: '#fff', color: '#0f172a', padding: '16px', borderRadius: '16px', minWidth: '80px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1' }}>{time.val}</div>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginTop: '4px' }}>{time.label}</div>
        </div>
      ))}
    </div>
  );
}
