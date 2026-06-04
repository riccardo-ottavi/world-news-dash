import dotenv from "dotenv";
import pkg from "@prisma/client";

dotenv.config();

const { PrismaClient } = (pkg as any) as { PrismaClient: new (...args: any[]) => any };

export const prisma = new PrismaClient();