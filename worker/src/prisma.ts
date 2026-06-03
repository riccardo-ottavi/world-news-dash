import pkg from "@prisma/client";

const { PrismaClient } = (pkg as any) as { PrismaClient: new (...args: any[]) => any };

export const prisma = new PrismaClient();