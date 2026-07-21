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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Global Dashboard Card Styles for children to inherit safely */
        .dashboard-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #F0DDE5;
          padding: 32px;
          box-shadow: 0 4px 12px rgba(115, 12, 99, 0.03);
          margin-bottom: 24px;
        }
        .dashboard-card-title {
          font-size: 20px;
          font-weight: 800;
          color: #730C63;
          margin-bottom: 24px;
        }
        .dashboard-btn-primary {
          background: #D63062;
          color: #FFFFFF;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }
        .dashboard-btn-primary:hover {
          background: #E71C25;
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .dashboard-card {
            padding: 24px 16px !important;
            border-radius: 16px;
          }
          .dashboard-layout-wrapper {
            padding: 16px !important;
            padding-bottom: 100px !important;
          }
          .dashboard-flex-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px;
            padding: 20px 16px !important;
          }
          .dashboard-table th, .dashboard-table td {
            padding: 16px !important;
          }
        }
      `}} />
    </div>
  );
}
