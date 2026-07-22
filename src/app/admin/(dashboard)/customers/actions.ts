'use server';

import { requireAdminSession } from '@/lib/admin-auth';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateCustomer(formData: FormData) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    const id = formData.get('id') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    await prisma.customer.update({
      where: { id: BigInt(id) },
      data: {
        firstName,
        lastName,
        email,
        phone,
      }
    });

    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${id}/edit`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleBlockCustomer(customerId: string, isBlocked: boolean) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    await prisma.customer.update({
      where: { id: BigInt(customerId) },
      data: { isBlocked }
    });

    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${customerId}/edit`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCustomer(customerId: string) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    // Relying on Prisma Cascade deletes for related tables (addresses, wishlist, conversations)
    await prisma.customer.delete({
      where: { id: BigInt(customerId) }
    });

    revalidatePath('/admin/customers');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
