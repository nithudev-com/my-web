import { PrismaClient } from "@prisma/client";

const globalForPrismaV7 = globalThis as unknown as { prisma?: PrismaClient };

// Force Hostinger to use the DIRECT_URL (5432) even if the panel has the PgBouncer URL (6543)
// This prevents ECIRCUITBREAKER and authentication failures caused by unencoded @ symbols or pool timeouts.
let fixedUrl = process.env.DATABASE_URL;
if (fixedUrl && fixedUrl.includes("6543")) {
  fixedUrl = fixedUrl
    .replace(":6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0", ":5432/postgres")
    .replace(":6543/postgres?pgbouncer=true", ":5432/postgres")
    .replace(":6543", ":5432");
}

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
