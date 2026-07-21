import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany({
    select: { slug: true }
  });
  console.log(cats.map(c => c.slug).join(', '));
}

main().catch(console.error).finally(() => prisma.$disconnect());
