const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika%402020@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0"
    }
  }
});
async function main() {
  try {
    console.log("Connecting to Supabase...");
    const data = await prisma.storeSettings.findFirst();
    console.log("Connected successfully! Store name:", data.storeName);
  } catch(e) {
    console.error("Connection failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
