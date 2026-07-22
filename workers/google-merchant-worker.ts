import { Worker } from "bullmq";
import IORedis from "ioredis";
import { submitProduct, deleteProductInput } from "../src/server/google-merchant/product-inputs";
import { prisma } from "../src/lib/prisma";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is required for google merchant worker");
}

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null
});

const worker = new Worker(
  "google-merchant-sync",
  async (job) => {
    try {
      if (job.name === "sync-product") {
        const { productId } = job.data;
        await job.updateProgress(10);
        await submitProduct(BigInt(productId));
        await job.updateProgress(100);
        return { success: true, productId };
      }

      if (job.name === "delete-product") {
        const { productId, offerId, merchantAccountId } = job.data;
        
        // Find data source to get the prefix for delete
        const dataSource = await prisma.googleMerchantDataSource.findFirst({
          where: { connection: { merchantAccountId } }
        });

        if (dataSource && dataSource.googleResourceName) {
          await deleteProductInput(merchantAccountId, dataSource.googleResourceName, offerId);
        }

        // Also clean up local configuration if requested or mark as deleted
        if (productId) {
          await prisma.googleProductConfiguration.update({
            where: { productId: BigInt(productId) },
            data: { enabled: false }
          });
          
          await prisma.googleProductStatus.update({
             where: { productId: BigInt(productId) },
             data: { approvalState: "REMOVED" }
          }).catch(() => {});
        }
        
        return { success: true, offerId };
      }
      
      throw new Error(`Unknown job type: ${job.name}`);
    } catch (err: any) {
      console.error(`Google Merchant Sync Job Failed [${job.id}]:`, err.message);
      
      // Update sync item if there's an associated sync job ID in real implementation
      // For now we just throw so BullMQ retries
      throw err;
    }
  },
  {
    // @ts-ignore
    connection,
    concurrency: 5,
    lockDuration: 60000,
  }
);

worker.on("completed", (job) => {
  console.log(`Google Merchant job ${job.id} completed successfully`);
});

worker.on("failed", (job, error) => {
  console.error(`Google Merchant job ${job?.id} failed`, error);
});

console.log("Google Merchant Sync worker is running...");

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}, closing worker...`);
  await worker.close();
  connection.disconnect();
  console.log('Worker closed gracefully.');
  process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
