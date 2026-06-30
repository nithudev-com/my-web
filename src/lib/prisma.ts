import { PrismaClient } from "@prisma/client";

const globalForPrismaV5 = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrismaV5.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrismaV5.prisma = prisma;
