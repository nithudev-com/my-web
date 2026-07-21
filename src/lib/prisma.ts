import { PrismaClient } from "@prisma/client";

const globalForPrismaV7 = globalThis as unknown as { prisma?: PrismaClient };

// Force the exact correct DATABASE_URL with port 6543 (PgBouncer transaction pooler)
// to avoid EMAXCONNSESSION (max clients reached) during Next.js parallel static builds.
// We hardcode the URL-encoded password (%40) to prevent Hostinger environment parsing bugs.
const fixedUrl = "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika%402020@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1";

// We MUST override the environment variables directly because the Prisma Rust engine
// reads from process.env internally during initialization and will crash if DIRECT_URL is malformed.
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
