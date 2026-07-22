import { CustomerNavigation } from './components/CustomerNavigation';
import { NotificationBell } from './components/NotificationBell';
import { getNotifications } from './notifications-actions';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const notifications = await getNotifications();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF4F7', fontFamily: 'inherit' }}>
      {/* Compact Top Header */}
      <header style={{ background: '#FFFFFF', padding: '16px 24px', borderBottom: '1px solid #F0DDE5', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: '#730C63', letterSpacing: '-0.02em' }}>Dashboard</span>
          </div>
          <div>
            <NotificationBell initialNotifications={notifications} />
          </div>
        </div>
      </header>

      <div className="dashboard-layout-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', paddingBottom: '100px', display: 'flex', gap: '32px' }}>
        <CustomerNavigation />
        
        <main className="dashboard-content" style={{ flex: 1, minWidth: 0, animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          {children}
        </main>
      </div>

      
    </div>
  );
}
