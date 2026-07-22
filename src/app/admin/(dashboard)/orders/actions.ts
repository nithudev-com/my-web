import { requireAdminSession } from '@/lib/admin-auth';
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: any) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    await prisma.order.update({
      where: { id: BigInt(orderId) },
      data: { status }
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
