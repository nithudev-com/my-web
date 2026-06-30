'use client';

import React from 'react';

export function NewMessageButton() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-live-chat'));
  };

  return (
    <button 
      onClick={handleClick} 
      className="dashboard-btn-primary" 
      style={{ padding: '10px 20px', fontSize: '14px', border: 'none', cursor: 'pointer' }}
    >
      New Message
    </button>
  );
}
