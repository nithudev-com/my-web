import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import "@/styles/storefront.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getStoreSettings } from "@/services/settings";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ClientDrawers } from '@/components/ClientDrawers';

const getCachedCategories = unstable_cache(
  async () => {
    if (!process.env.DATABASE_URL) return [];
    try {
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
    } catch (e) {
      console.warn("Failed to get layout categories during build:", e);
      return [];
    }
  },
  ['layout-categories'],
  { revalidate: 3600, tags: ['menu-categories'] }
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
        <ClientDrawers />
      </WishlistProvider>
    </CartProvider>
  );
}
