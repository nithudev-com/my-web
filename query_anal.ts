import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany({
    where: { name: { contains: 'anal', mode: 'insensitive' } },
    select: { id: true, name: true, slug: true }
  });
  console.log(cats);
}

main().catch(console.error).finally(() => prisma.$disconnect());
