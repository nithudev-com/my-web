import { readFileSync } from "fs";
import { parseProductCsv, createImportBatch, processImportBatch } from "./src/services/import-products";

async function run() {
  const files = [
    "uploadsheet/EP products.csv",
    "uploadsheet/Living products - Sheet1.csv"
  ];
  
  for (const file of files) {
    console.log(`Processing ${file}...`);
    const csvText = readFileSync(file, "utf-8");
    const rows = parseProductCsv(csvText);
    const batchId = await createImportBatch(file, rows);
    console.log(`Batch ID: ${batchId}`);
    const result = await processImportBatch(batchId);
    console.log(`Result for ${file}:`, result);
  }
}

run().catch(console.error).finally(() => process.exit(0));
