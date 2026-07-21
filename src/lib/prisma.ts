import { PrismaClient } from "@prisma/client";

const globalForPrismaV7 = globalThis as unknown as { prisma?: PrismaClient };

// Force the exact correct DATABASE_URL because Hostinger's environment variable panel
// automatically unescapes '%40' to '@', which breaks the Prisma Postgres parser.
const fixedUrl = "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika%402020@aws-0-ca-central-1.pooler.supabase.com:5432/postgres";

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
