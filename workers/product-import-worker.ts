import { Worker } from "bullmq";
import IORedis from "ioredis";
import { processImportBatch } from "../src/services/import-products";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is required for import worker");
}

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null
});

const worker = new Worker(
  "product-import",
  async (job) => {
    const { batchId } = job.data as { batchId: string };
    
    // Simulate some progress updates to satisfy job progress reporting
    await job.updateProgress(10);
    const result = await processImportBatch(batchId);
    await job.updateProgress(90);

    // Optional: call your deployed app's revalidation endpoint after a big import.
    if (process.env.NEXT_PUBLIC_SITE_URL && process.env.REVALIDATE_SECRET) {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret: process.env.REVALIDATE_SECRET,
          paths: ["/", "/sitemap.xml"],
          tags: ["products", "categories", "home-products"]
        })
      }).catch(() => undefined);
    }
    
    await job.updateProgress(100);
    return result;
  },
  {
    // @ts-ignore - BullMQ and ioredis types conflict
    connection,
    concurrency: 2,
    lockDuration: 60000,
  }
);

worker.on("completed", (job) => {
  console.log(`Import job ${job.id} completed successfully`);
});

worker.on("failed", (job, error) => {
  console.error(`Import job ${job?.id} failed`, error);
});

console.log("Product import worker is running...");

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
