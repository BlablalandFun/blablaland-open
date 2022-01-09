import { PrismaClient } from "@prisma/client";

declare module '@blablaland/db' {
  const prisma: PrismaClient;
}