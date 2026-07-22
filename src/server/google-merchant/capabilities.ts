import "server-only";
import { GoogleMerchantClient } from "./client";
import { prisma } from "@/lib/prisma";

export interface AccountCapabilities {
  promotions: boolean;
  localInventory: boolean;
  regionalInventory: boolean;
  reports: boolean;
  lca: boolean; // Local Content API / Advanced features
}

export async function detectCapabilities(merchantAccountId: string): Promise<AccountCapabilities> {
  const client = new GoogleMerchantClient(merchantAccountId);
  const defaultCaps = {
    promotions: false,
    localInventory: false,
    regionalInventory: false,
    reports: true, // Generally available
    lca: false,
  };

  try {
    const accountInfo = await client.getAccountInfo();
    // In a full implementation, you would inspect account programs/services from the Merchant API
    // e.g. check if promotions are enrolled.
    // For now we will rely on admin settings or API introspection.
    
    // Attempting to list promotions to see if enabled:
    // If it throws a 403, it's not enabled.
    try {
      await client.fetchApi(`promotions/v1beta/accounts/${merchantAccountId}/promotions`);
      defaultCaps.promotions = true;
    } catch (e) {
      // Ignore
    }
    
    // Attempting to list local inventory
    try {
      await client.fetchApi(`lfp/v1beta/accounts/${merchantAccountId}/lfpStores`);
      defaultCaps.localInventory = true;
    } catch (e) {
      // Ignore
    }

  } catch (err) {
    console.warn("Failed to detect all capabilities", err);
  }

  return defaultCaps;
}
