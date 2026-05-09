import type { Metadata } from "next"

import { getAllTools, CATEGORIES } from "@/features/tools"
import { ToolSearch } from "@/components/tools/ToolSearch"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"
import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = createMetadata({
  title:       "Ferramentas",
  description:
    "Mais de 50 ferramentas online gratuitas: calculadoras, conversores e utilitários. Sem cadastro, sem limites.",
  slug:     "ferramentas",
  keywords: ["ferramentas online", "calculadoras", "conversores", "grátis", "sem cadastro"],
})

export default function ToolsPage() {
  const tools = getAllTools()

  return (
    <main>
      {/* Hero */}
      <Section spacing="sm" className="border-b border-border bg-card/30">
        <Container>
          <div className="flex flex-col gap-4">
            <div className="w-fit rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Ferramentas
            </div>
            <Heading as="h1" size="2xl" className="max-w-lg">
              Todas as ferramentas
            </Heading>
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              {tools.length} ferramentas gratuitas para o seu dia a dia. Sem
              cadastro, sem limites.
            </p>
          </div>
        </Container>
      </Section>

      {/* Browser */}
      <Section spacing="default">
        <Container>
          <ToolSearch tools={tools} categories={CATEGORIES} />
        </Container>
      </Section>
    </main>
  )
}
