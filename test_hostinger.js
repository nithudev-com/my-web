const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika%402020@aws-0-ca-central-1.pooler.supabase.com:5432/postgres"
    }
  }
});
async function main() {
  try {
    const data = await prisma.storeSettings.findFirst();
    console.log("SUCCESS:", data.storeName);
  } catch(e) {
    console.error("FAIL:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
