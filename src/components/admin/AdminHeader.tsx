'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/app/admin/login/actions";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header style={{ 
      background: '#fff', 
      borderBottom: '1px solid var(--border)', 
      padding: '12px 40px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '20px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="muted" style={{ fontSize: '13px' }}>Logged in as <strong>admin</strong></span>
        <button 
          onClick={handleLogout}
          style={{ 
            fontSize: '13px', 
            color: '#dc2626', 
            fontWeight: '600',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #fee2e2',
            background: 'transparent',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
