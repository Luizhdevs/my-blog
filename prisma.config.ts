// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — Prisma 7 config types ainda em desenvolvimento
import { readFileSync } from "fs"
import { join }         from "path"
import { PrismaPg }     from "@prisma/adapter-pg"
import { defineConfig } from "prisma/config"
import { Pool }         from "pg"

// Prisma evaluates this config before loading .env, so we load it manually
try {
  const content = readFileSync(join(process.cwd(), ".env"), "utf-8")
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=][^=]*)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^["']|["']$/g, "")
      if (!process.env[key]) process.env[key] = val
    }
  }
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
  migrate: {
    async adapter() {
      const pool = new Pool({
        connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
      })
      return new PrismaPg(pool)
    },
  },
})
