import { prisma } from "./src/lib/prisma";

async function run() {
  const products = await prisma.product.findMany({
    where: { status: "DRAFT" },
    take: 5,
    select: { title: true, sku: true, basePrice: true, status: true }
  });
  console.log(JSON.stringify(products, null, 2));
}

run().catch(console.error).finally(() => process.exit(0));
