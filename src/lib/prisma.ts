import { PrismaClient } from "@prisma/client";

const globalForPrismaV7 = globalThis as unknown as { prisma?: PrismaClient };

// We must hardcode the URL because Hostinger's Auto Deploy system does NOT provide 
// environment variables (like DATABASE_URL) to the "npm run build" process. 
// Without this, Next.js fails to statically generate the pages during deployment.
const fixedUrl = "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika%402020@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5";

process.env.DATABASE_URL = fixedUrl;
process.env.DIRECT_URL = "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika%402020@aws-0-ca-central-1.pooler.supabase.com:5432/postgres";

export const prisma =
  globalForPrismaV7.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: fixedUrl
      }
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrismaV7.prisma = prisma;
