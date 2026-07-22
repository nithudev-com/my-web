'use client';

import dynamic from 'next/dynamic';

const LiveChatWidget = dynamic(() => import('@/components/LiveChatWidget').then(mod => mod.LiveChatWidget), { ssr: false });
const SlideOutCart = dynamic(() => import('@/components/SlideOutCart').then(mod => mod.SlideOutCart), { ssr: false });
const MobileBottomNav = dynamic(() => import('@/components/MobileBottomNav').then(mod => mod.MobileBottomNav), { ssr: false });

export function ClientDrawers() {
  return (
    <>
      <SlideOutCart />
      <MobileBottomNav />
      <LiveChatWidget />
    </>
  );
}
