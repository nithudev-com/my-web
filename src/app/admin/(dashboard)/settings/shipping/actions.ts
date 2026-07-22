import { requireAdminSession } from '@/lib/admin-auth';
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createShippingMethod(formData: FormData) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    const name = formData.get('name') as string;
    const priceStr = formData.get('price') as string;
    const estimatedDays = formData.get('estimatedDays') as string;

    await prisma.shippingMethod.create({
      data: {
        name,
        price: parseFloat(priceStr),
        estimatedDays,
        isActive: true
      }
    });

    revalidatePath('/admin/settings/shipping');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateShippingMethod(id: string, formData: FormData) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    const name = formData.get('name') as string;
    const priceStr = formData.get('price') as string;
    const estimatedDays = formData.get('estimatedDays') as string;

    await prisma.shippingMethod.update({
      where: { id: BigInt(id) },
      data: {
        name,
        price: parseFloat(priceStr),
        estimatedDays,
      }
    });

    revalidatePath('/admin/settings/shipping');
    revalidatePath(`/admin/settings/shipping/${id}/edit`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleShippingStatus(id: string, isActive: boolean) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    await prisma.shippingMethod.update({
      where: { id: BigInt(id) },
      data: { isActive }
    });

    revalidatePath('/admin/settings/shipping');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteShippingMethod(id: string) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    await prisma.shippingMethod.delete({
      where: { id: BigInt(id) }
    });

    revalidatePath('/admin/settings/shipping');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
