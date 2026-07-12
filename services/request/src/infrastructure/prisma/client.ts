import { PrismaClient } from "@prisma/client";

// Singleton para evitar múltiplas conexões em ambiente serverless (Cloud Run)
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});
