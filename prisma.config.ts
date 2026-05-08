// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — Prisma 7 config types ainda em desenvolvimento
import { PrismaPg } from "@prisma/adapter-pg"
import { defineConfig } from "prisma/config"
import { Pool } from "pg"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    async adapter() {
      const pool = new Pool({
        connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
      })
      return new PrismaPg(pool)
    },
  },
})
