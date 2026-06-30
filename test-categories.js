const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log("Categories count:", categories.length);
  if (categories.length > 0) {
    console.log("Sample:", categories.slice(0, 3));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
