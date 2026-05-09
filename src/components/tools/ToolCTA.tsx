import Link from "next/link"
import { ArrowRight, LayoutGrid } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Section } from "@/components/shared/Section"
import { Container } from "@/components/shared/Container"

export function ToolCTA() {
  return (
    <Section spacing="sm">
      <Container size="md">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <LayoutGrid className="size-5 text-primary" aria-hidden />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Explore mais ferramentas
            </h2>
            <p className="text-sm text-muted-foreground">
              Mais de 50 ferramentas gratuitas para o seu dia a dia.
            </p>
          </div>

          <Button asChild className="rounded-full">
            <Link href="/ferramentas">
              Ver todas as ferramentas
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
