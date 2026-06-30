import { Queue } from "bullmq";
import { getRedis } from "@/lib/redis";

export type ProductImportJob = {
  batchId: string;
};

export function getProductImportQueue() {
  const connection = getRedis();
  if (!connection) return null;

  return new Queue<ProductImportJob>("product-import", {
    // @ts-ignore - BullMQ and ioredis types conflict
    connection
  });
}
