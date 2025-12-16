import { PrismaClient } from "@prisma/client/extension";

export const prisma = new PrismaClient({
  adapter: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
});
