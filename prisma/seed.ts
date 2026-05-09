import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) throw new Error("Set ADMIN_EMAIL env var to your Supabase Auth email")

  await db.user.upsert({
    where:  { email: adminEmail },
    create: { email: adminEmail, role: "ADMIN", name: "Admin" },
    update: { role: "ADMIN" },
  })

  console.log(`✅ Admin user seeded: ${adminEmail}`)

  // Seed default blog categories
  const blogCats = [
    { slug: "financeiro",    name: "Finanças",      color: "emerald", type: "BLOG" as const },
    { slug: "matematica",    name: "Matemática",    color: "blue",    type: "BLOG" as const },
    { slug: "tecnologia",    name: "Tecnologia",    color: "violet",  type: "BLOG" as const },
    { slug: "produtividade", name: "Produtividade", color: "amber",   type: "BLOG" as const },
  ]

  for (const cat of blogCats) {
    await db.category.upsert({
      where:  { slug: cat.slug },
      create: cat,
      update: {},
    })
  }
  console.log(`✅ Blog categories seeded`)

  // Seed core tools
  const tools = [
    {
      slug:        "juros-compostos",
      name:        "Calculadora de Juros Compostos",
      description: "Calcule montante final e rendimentos com juros compostos.",
      icon:        "📈",
      isPublished: true,
    },
    {
      slug:        "calculadora-porcentagem",
      name:        "Calculadora de Porcentagem",
      description: "Calcule porcentagens, variações e proporções com facilidade.",
      icon:        "📊",
      isPublished: true,
    },
    {
      slug:        "conversor-moedas",
      name:        "Conversor de Moedas",
      description: "Converta entre 13 moedas com taxas de referência atualizadas.",
      icon:        "💱",
      isPublished: true,
    },
  ]

  for (const tool of tools) {
    await db.tool.upsert({
      where:  { slug: tool.slug },
      create: tool,
      update: {},
    })
  }
  console.log(`✅ Tools seeded`)
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1) })
