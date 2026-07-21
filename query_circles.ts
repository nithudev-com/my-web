import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const circles = await prisma.categoryCircle.findMany();
  console.log(circles);
}

main().catch(console.error).finally(() => prisma.$disconnect());
