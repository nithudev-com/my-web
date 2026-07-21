import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.categoryCircle.update({
    where: { id: BigInt(7) },
    data: { url: '/category/cock-rings' }
  });
  console.log("Fixed circle 7 to point to /category/cock-rings");
}

main().catch(console.error).finally(() => prisma.$disconnect());
