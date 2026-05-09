import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { AnimateIn } from "@/components/shared"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"
import { Button } from "@/components/ui/button"
import { HeroMockup } from "./HeroMockup"

const trustSignals = [
  "50+ ferramentas disponíveis",
  "Atualizado semanalmente",
  "Código aberto",
]

export function HeroSection() {
  return (
    <Section spacing="xl" className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute right-0 top-0 h-[700px] w-[700px] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute -bottom-48 left-0 h-[500px] w-[500px] -translate-x-1/3 rounded-full bg-accent/50 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.281 0.063 213) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Content */}
          <AnimateIn variant="fadeInUp">
            <div className="flex max-w-xl flex-col gap-7">
              {/* Eyebrow */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-sm text-muted-foreground shadow-xs backdrop-blur-sm">
                <span
                  className="size-1.5 rounded-full bg-emerald-500 animate-pulse"
                  aria-hidden
                />
                Plataforma gratuita · Sem cadastro necessário
              </div>

              <Heading
                as="h1"
                size="4xl"
                className="max-w-[14ch] font-extrabold leading-[1.08]"
              >
                Ferramentas inteligentes para seu fluxo de trabalho
              </Heading>

              <p className="max-w-md text-lg leading-[1.7] text-muted-foreground text-pretty">
                Calculadoras financeiras, conversores, utilitários de código e
                muito mais. Rápido, acessível e sempre atualizado.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 font-semibold shadow-sm"
                >
                  <Link href="/ferramentas">
                    Explorar ferramentas
                    <ArrowRight className="ml-2 size-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                >
                  <Link href="/blog">Ler artigos</Link>
                </Button>
              </div>

              {/* Trust signals */}
              <ul
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
                aria-label="Destaques da plataforma"
              >
                {trustSignals.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="size-3.5 shrink-0 text-primary/60" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>

          {/* Visual mockup */}
          <AnimateIn
            variant="scaleIn"
            delay={0.15}
            className="flex justify-center lg:justify-end"
          >
            <HeroMockup />
          </AnimateIn>
        </div>
      </Container>
    </Section>
  )
}
