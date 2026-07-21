import { PrismaClient } from "@prisma/client";

const globalForPrismaV7 = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Hostinger Environment Fixer
 * Hostinger's panel often passes passwords with a literal `@` (unencoded), which crashes Prisma.
 * This dynamically intercepts the environment variables and encodes the password safely.
 */
function fixPrismaUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  // Matches: 1=postgresql://user:  2=password  3=@host:port/db...
  const match = url.match(/^(postgresql:\/\/[^:]+:)(.*)(@[^@]+:\d+\/.*)$/);
  if (match) {
    const prefix = match[1];
    let password = match[2];
    const suffix = match[3];
    
    // Hostinger sometimes escapes the % sign as \% in its backend. Unescape it first.
    password = password.replace(/\\%/g, "%");
    
    // Then, replace any literal @ with %40
    password = password.replace(/@/g, "%40");
    
    return `${prefix}${password}${suffix}`;
  }
  return url;
}

// Dynamically fix the environment variables from the Hostinger panel before Prisma loads them
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = fixPrismaUrl(process.env.DATABASE_URL)!;
}
if (process.env.DIRECT_URL) {
  process.env.DIRECT_URL = fixPrismaUrl(process.env.DIRECT_URL)!;
}

// Prevent "OS can't spawn worker thread (os error 11)" on Hostinger shared servers
process.env.TOKIO_WORKER_THREADS = "1";

export const prisma =
  globalForPrismaV7.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrismaV7.prisma = prisma;
