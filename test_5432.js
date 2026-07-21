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
    console.log("Connected 5432!", data.storeName);
  } catch(e) {
    console.error("Connection failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
