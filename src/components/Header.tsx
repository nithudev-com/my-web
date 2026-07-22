import Link from "next/link";
import { AutocompleteSearch } from "./AutocompleteSearch";
import { 
  HeaderAuthButton, 
  HeaderWishlistButton, 
  HeaderCartButton, 
  DesktopBottomNav, 
  MobileHeaderWrapper 
} from "./HeaderClientIslands";

export function Header({ settings, categories = [] }: { settings: any, categories?: any[] }) {
  return (
    <>
      {/* --- DESKTOP HEADER --- */}
      <header className="mega-header-wrapper desktop-header">
        
        {/* 1. Top Announcement Bar */}
        <div className="top-announcement-bar">
          <div>🔥 Free standard shipping on all orders over $100!</div>
          <div className="top-bar-links">
            <Link prefetch={true} href="/contact">Store Locator</Link>
            <Link prefetch={true} href="/account/orders">Track Order</Link>
            <Link prefetch={true} href="/contact">Help Center</Link>
            <span style={{ marginLeft: '16px', color: '#cbd5e1' }}>|</span>
            <span style={{ marginLeft: '16px' }}>ENG / CAD</span>
          </div>
        </div>

        {/* 2. Main Hub */}
        <div className="main-header-hub">
          <Link prefetch={true} href="/" className="mega-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo-new.png" alt={settings.storeName || "SexToys Lovers"} style={{ maxHeight: '44px', width: 'auto' }} />
          </Link>
          
          <AutocompleteSearch isMobile={false} categories={categories} />

          <div className="header-action-group">
            <HeaderAuthButton />
            <HeaderWishlistButton />
            <HeaderCartButton />
          </div>
        </div>

        {/* 3. Bottom Navigation */}
        <DesktopBottomNav categories={categories} />
      </header>

      {/* --- MOBILE HEADER & DRAWER --- */}
      <MobileHeaderWrapper settings={settings} categories={categories} />
    </>
  );
}
