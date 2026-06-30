'use client';

import { useState, useTransition } from 'react';
import { toggleCategoryHomeVisibility } from './actions';

export default function ToggleHomeCategoryButton({ 
  id, 
  initialState 
}: { 
  id: string, 
  initialState: boolean 
}) {
  const [isPending, startTransition] = useTransition();
  const [showOnHome, setShowOnHome] = useState(initialState);

  const handleToggle = () => {
    const newState = !showOnHome;
    setShowOnHome(newState); // Optimistic UI update

    startTransition(async () => {
      const result = await toggleCategoryHomeVisibility(id, newState);
      if (!result.success) {
        // Revert on failure
        setShowOnHome(!newState);
        alert('Failed to update visibility');
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      style={{ 
        marginLeft: '12px', 
        background: showOnHome ? '#ecfdf5' : '#f1f5f9', 
        color: showOnHome ? '#059669' : '#64748b', 
        border: `1px solid ${showOnHome ? '#a7f3d0' : '#cbd5e1'}`,
        fontSize: '11px', 
        padding: '2px 8px', 
        borderRadius: '12px', 
        fontWeight: 'bold',
        cursor: isPending ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}
      title={showOnHome ? "Click to remove from Home Page" : "Click to show on Home Page"}
    >
      <span style={{ 
        display: 'inline-block', 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: showOnHome ? '#10b981' : '#94a3b8' 
      }}></span>
      {showOnHome ? 'On Home' : 'Off Home'}
    </button>
  );
}
