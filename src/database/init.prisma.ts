import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      {
        emit: "stdout",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// class Database {
//   static instance: any;

//   constructor() {
//     this.connect();
//   }

//   private connect() {
//     const prisma = new PrismaClient();
//   }

//   static getInstance() {
//     if (!Database.instance) {
//       Database.instance = new Database();
//     }
//     return Database.instance;
//   }
// }

// export const prismaInstance = Database.getInstance();
