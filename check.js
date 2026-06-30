const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roots = await prisma.category.findMany({ where: { parentId: null } });
  console.log("ROOTS:", roots.map(r => r.name));
  const all = await prisma.category.findMany();
  console.log("ALL:", all.length);
  
  const allCats = all.map(c => c.name);
  console.log("All cats:", allCats);
}

main().catch(console.error).finally(() => prisma.$disconnect());
