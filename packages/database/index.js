import client from '@prisma/client'

const prisma = global.prisma || new client.PrismaClient();
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export const prisma;