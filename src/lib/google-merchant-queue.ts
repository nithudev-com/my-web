import "server-only";
import { Queue } from "bullmq";
import { getRedis } from "./redis";

export const googleMerchantSyncQueue = new Queue("google-merchant-sync", {
  // @ts-ignore
  connection: getRedis(),
});

export const googleMerchantStatusQueue = new Queue("google-merchant-status", {
  // @ts-ignore
  connection: getRedis(),
});

export const googleMerchantReportsQueue = new Queue("google-merchant-reports", {
  // @ts-ignore
  connection: getRedis(),
});

export async function queueProductSync(productId: bigint, adminId?: bigint) {
  await googleMerchantSyncQueue.add(
    "sync-product", 
    { productId: productId.toString(), adminId: adminId?.toString() },
    { 
      removeOnComplete: true, 
      removeOnFail: 100, 
      attempts: 3, 
      backoff: { type: "exponential", delay: 5000 }
    }
  );
}

export async function queueProductDeletion(productId: bigint, offerId: string, merchantAccountId: string, adminId?: bigint) {
  await googleMerchantSyncQueue.add(
    "delete-product", 
    { productId: productId.toString(), offerId, merchantAccountId, adminId: adminId?.toString() },
    { removeOnComplete: true, removeOnFail: 100, attempts: 3, backoff: { type: "exponential", delay: 5000 } }
  );
}
