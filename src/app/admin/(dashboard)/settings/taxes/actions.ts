'use server';

import { requireAdminSession } from '@/lib/admin-auth';

import { updateStoreSettings, getStoreSettings } from '@/services/settings';
import { revalidatePath } from 'next/cache';

export async function getTaxSettings() {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  const settings = await getStoreSettings();
  return {
    taxEnabled: settings.taxEnabled,
    taxIncludedInPrices: settings.taxIncludedInPrices,
    taxRate: Number(settings.taxRate)
  };
}

export async function saveTaxConfiguration(data: {
  taxEnabled: boolean;
  taxIncludedInPrices: boolean;
  taxRate: number;
}) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    const res = await updateStoreSettings({
      taxEnabled: data.taxEnabled,
      taxIncludedInPrices: data.taxIncludedInPrices,
      taxRate: data.taxRate
    });

    if (res.success) {
      revalidatePath('/admin/settings/taxes');
      return { success: true };
    }
    
    return { success: false, error: res.error };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
