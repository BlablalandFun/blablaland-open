import prismaLib from '@prisma/client'

export const prisma = global.prisma || new prismaLib.PrismaClient();
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}