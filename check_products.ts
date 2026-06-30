import { prisma } from "./src/lib/prisma";

async function run() {
  const products = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { title: true, sku: true, basePrice: true, status: true, description: true }
  });
  console.log(JSON.stringify(products, null, 2));
}

run().catch(console.error).finally(() => process.exit(0));
