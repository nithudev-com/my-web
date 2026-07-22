import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getStoreSettings } from "@/services/settings";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import dynamic from 'next/dynamic';

const LiveChatWidget = dynamic(() => import('@/components/LiveChatWidget').then(mod => mod.LiveChatWidget), { ssr: false });
const SlideOutCart = dynamic(() => import('@/components/SlideOutCart').then(mod => mod.SlideOutCart), { ssr: false });

const getCachedCategories = unstable_cache(
  async () => {
    const data = await prisma.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            children: {
              select: {
                id: true,
                name: true,
                slug: true
              },
              orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
            }
          },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
        }
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      take: 20
    });
    return JSON.parse(JSON.stringify(data, (k, v) => typeof v === 'bigint' ? v.toString() : v));
  },
  ['layout-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeSettings = await getStoreSettings();
  const categories = await getCachedCategories();
  const safeSettings = JSON.parse(JSON.stringify(storeSettings, (k, v) => typeof v === 'bigint' ? v.toString() : v));
  const safeCategories = JSON.parse(JSON.stringify(categories, (k, v) => typeof v === 'bigint' ? v.toString() : v));

  return (
    <CartProvider>
      <WishlistProvider>
        <Header settings={safeSettings} categories={safeCategories} />
        {children}
        <Footer settings={safeSettings} />
        <SlideOutCart />
        <MobileBottomNav />
        <LiveChatWidget />
      </WishlistProvider>
    </CartProvider>
  );
}
