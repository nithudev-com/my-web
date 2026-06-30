'use server';

import { updateStoreSettings, getStoreSettings } from '@/services/settings';
import { revalidatePath } from 'next/cache';

export async function getTaxSettings() {
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
