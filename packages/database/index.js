import client from '@prisma/client'

export const prisma = global.prisma || new client.PrismaClient();
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}