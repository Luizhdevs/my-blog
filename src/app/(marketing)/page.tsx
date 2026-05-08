import type { Metadata } from "next"
import Link from "next/link"

import { AnimateIn, StaggerIn, StaggerChild } from "@/components/shared"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title:       siteConfig.name,
  description: siteConfig.description,
}

export default function HomePage() {
  return (
    <>
      {/* Hero placeholder — será substituído na próxima etapa */}
      <Section spacing="lg" className="relative overflow-hidden">
        <Container>
          <AnimateIn variant="fadeInUp" className="max-w-3xl">
            <Badge variant="secondary" className="mb-6">
              🚀 Plataforma em construção
            </Badge>

            <Heading as="h1" size="3xl" className="mb-6">
              {siteConfig.tagline}
            </Heading>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {siteConfig.description}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8 font-semibold">
                <Link href="/ferramentas">Ver Ferramentas</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/blog">Ler Blog</Link>
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* Features placeholder */}
      <Section spacing="default" background="muted">
        <Container>
          <AnimateIn variant="fadeInUp" className="mb-12 text-center">
            <Heading as="h2" size="xl" align="center" className="mb-4">
              Tudo em um só lugar
            </Heading>
            <p className="mx-auto max-w-lg text-muted-foreground">
              Design system funcional. Layout pronto. Fundação sólida.
            </p>
          </AnimateIn>

          <StaggerIn className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Blog", "Ferramentas", "Calculadoras"].map((item) => (
              <StaggerChild key={item}>
                <div className="card-hover rounded-xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-heading font-semibold text-foreground">{item}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Em breve disponível na plataforma.
                  </p>
                </div>
              </StaggerChild>
            ))}
          </StaggerIn>
        </Container>
      </Section>
    </>
  )
}
