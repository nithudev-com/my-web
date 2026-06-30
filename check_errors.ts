import { prisma } from "./src/lib/prisma";

async function run() {
  const failedRows = await prisma.productImportRow.findMany({
    where: { errorMessage: { not: null } },
    take: 5
  });
  console.log(failedRows.map(r => r.errorMessage));
}

run().catch(console.error).finally(() => process.exit(0));
