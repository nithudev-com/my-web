'use server';

import { requireAdminSession } from '@/lib/admin-auth';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleCategoryHomeVisibility(id: string, showOnHome: boolean) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    await prisma.category.update({
      where: { id: BigInt(id) },
      data: { showOnHome },
    });
    revalidatePath('/admin/categories');
    revalidatePath('/'); // Revalidate the frontend home page as well
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle category visibility:', error);
    return { success: false, error: 'Failed to update visibility' };
  }
}
