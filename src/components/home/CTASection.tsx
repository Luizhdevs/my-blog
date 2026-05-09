import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { AnimateIn } from "@/components/shared"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <Section
      spacing="lg"
      className="relative overflow-hidden bg-[oklch(0.115_0.018_213)]"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Container className="relative z-10">
        <AnimateIn variant="fadeInUp">
          <div className="flex flex-col items-center gap-7 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
              <Sparkles className="size-7 text-white" aria-hidden />
            </div>

            <div className="flex flex-col items-center gap-4">
              <Heading as="h2" size="3xl" align="center" textColor="white">
                Pronto para começar?
              </Heading>
              <p className="max-w-md text-lg leading-[1.7] text-white/65">
                Explore mais de 50 ferramentas gratuitas ou mergulhe em nossos
                artigos técnicos. Sem cadastro, sem barreiras.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-8 font-semibold text-[oklch(0.13_0_0)] shadow-sm hover:bg-white/90"
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
                className="rounded-full border-white/25 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/blog">Ler o blog</Link>
              </Button>
            </div>
          </div>
        </AnimateIn>
      </Container>
    </Section>
  )
}
