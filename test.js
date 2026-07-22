const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  console.time('db');
  await prisma.category.findFirst();
  console.timeEnd('db');
}
test();
