'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export type NotificationData = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  date: string;
};

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export async function getNotifications(): Promise<NotificationData[]> {
  const cookieStore = await cookies();
  const customerIdStr = cookieStore.get('customer_auth')?.value;
  if (!customerIdStr) return [];
  const customerId = BigInt(customerIdStr);

  const notifs = await prisma.notification.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return notifs.map(n => ({
    id: n.id.toString(),
    title: n.title,
    message: n.message,
    read: n.read,
    link: n.link,
    date: timeAgo(n.createdAt)
  }));
}

export async function markNotificationsAsRead(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const customerIdStr = cookieStore.get('customer_auth')?.value;
  if (!customerIdStr) return { success: false };
  const customerId = BigInt(customerIdStr);

  await prisma.notification.updateMany({
    where: { customerId, read: false },
    data: { read: true }
  });

  revalidateTag('notifications');
  return { success: true };
}

export async function markNotificationAsRead(id: string): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const customerIdStr = cookieStore.get('customer_auth')?.value;
  if (!customerIdStr) return { success: false };
  const customerId = BigInt(customerIdStr);

  await prisma.notification.updateMany({
    where: { customerId, id: BigInt(id) },
    data: { read: true }
  });

  revalidateTag('notifications');
  return { success: true };
}
