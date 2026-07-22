'use server';

import { requireCustomerSession } from '@/lib/customer-auth';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const COOKIE_NAME = 'recently_viewed';
const MAX_ITEMS = 20;

export async function trackProductView(productId: string) {
  const _customerSession = await requireCustomerSession();
  if (!_customerSession) throw new Error("Unauthorized");

  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(COOKIE_NAME)?.value;
  
  let viewedIds: string[] = [];
  if (existingCookie) {
    try {
      viewedIds = JSON.parse(existingCookie);
    } catch {
      viewedIds = [];
    }
  }

  // Remove if exists to push to front
  viewedIds = viewedIds.filter(id => id !== productId);
  viewedIds.unshift(productId);

  // Keep only latest 20
  if (viewedIds.length > MAX_ITEMS) {
    viewedIds = viewedIds.slice(0, MAX_ITEMS);
  }

  cookieStore.set(COOKIE_NAME, JSON.stringify(viewedIds), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/'
  });
}

export async function clearRecentlyViewed() {
  const _customerSession = await requireCustomerSession();
  if (!_customerSession) throw new Error("Unauthorized");

  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  revalidatePath('/account/recently-viewed');
}
