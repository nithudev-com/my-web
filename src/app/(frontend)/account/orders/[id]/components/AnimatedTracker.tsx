'use client';

import { useEffect, useState } from 'react';

export function AnimatedTracker({ orderStatus, orderDate }: { orderStatus: string, orderDate: string }) {
  const [fillWidth, setFillWidth] = useState('0%');

  // Map backend status to 4 distinct steps
  // Step 0: Placed
  // Step 1: Paid/Confirmed
  // Step 2: Processing/Shipped
  // Step 3: Delivered
  let currentStep = 0;
  if (orderStatus !== 'PENDING' && orderStatus !== 'FAILED' && orderStatus !== 'CANCELLED' && orderStatus !== 'EXPIRED') currentStep = 1;
  if (orderStatus === 'PROCESSING' || orderStatus === 'SHIPPED' || orderStatus === 'OUT_FOR_DELIVERY' || orderStatus === 'DELIVERED') currentStep = 2;
  if (orderStatus === 'DELIVERED') currentStep = 3;

  useEffect(() => {
    // Animate the progress bar on mount
    const percentages = ['0%', '33%', '66%', '100%'];
    setTimeout(() => {
      setFillWidth(percentages[currentStep]);
    }, 300);
  }, [currentStep]);

  const steps = [
    {
      title: 'Order Placed',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
    },
    {
      title: 'Confirmed',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
    },
    {
      title: 'Shipped',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>,
      isDriving: currentStep === 2
    },
    {
      title: 'Delivered',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    }
  ];

  // Calculate estimated delivery (e.g. 5 days from order)
  const estDate = new Date(orderDate);
  estDate.setDate(estDate.getDate() + 5);

  if (orderStatus === 'CANCELLED' || orderStatus === 'FAILED' || orderStatus === 'EXPIRED' || orderStatus === 'REFUNDED') {
    return (
      <div className="tracker-wrapper">
        <div style={{ textAlign: 'center', padding: '32px', background: '#fef2f2', borderRadius: '16px', border: '1px solid #fca5a5' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#7f1d1d', margin: '0 0 8px 0' }}>Order {orderStatus}</h3>
          <p style={{ color: '#991b1b', margin: 0 }}>This order has been cancelled or failed and will not be delivered.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tracker-wrapper">
      <div className="tracker-bg-line"></div>
      <div className="tracker-fill-line" style={{ width: fillWidth }}></div>

      <div className="tracker-steps-container">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          
          let boxClass = "tracker-icon-box";
          if (isCompleted || (idx === 3 && currentStep === 3)) boxClass += " completed";
          if (isActive && idx !== 3) boxClass += " active";
          if (step.isDriving) boxClass += " driving";

          return (
            <div key={idx} className="tracker-step">
              <div className={boxClass}>
                {step.icon}
              </div>
              <div className={`tracker-label ${isCompleted || isActive ? 'active-label' : ''}`}>
                {step.title}
              </div>
            </div>
          );
        })}
      </div>

      {orderStatus !== 'DELIVERED' && (
        <div style={{ marginTop: '48px', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: '#e0e7ff', color: '#4338ca', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0', fontWeight: '700', textTransform: 'uppercase' }}>Estimated Delivery</h4>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#111111' }}>
              {estDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
