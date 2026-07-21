const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const count = await prisma.product.count();
    console.log("Connection successful. Product count:", count);
  } catch (error) {
    console.error("Prisma Connection Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
