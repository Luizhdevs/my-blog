import {
  Zap,
  ShieldOff,
  Smartphone,
  RefreshCw,
  Accessibility,
  GitBranch,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { AnimateIn, StaggerIn, StaggerChild } from "@/components/shared"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"

interface Benefit {
  icon:        LucideIcon
  title:       string
  description: string
  iconColor:   string
}

const benefits: Benefit[] = [
  {
    icon:        Zap,
    title:       "Rápido e Leve",
    description: "Ferramentas otimizadas que carregam em milissegundos. Sem bloatware, sem trackers.",
    iconColor:   "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  },
  {
    icon:        ShieldOff,
    title:       "Sem Cadastro",
    description: "Use imediatamente. Sem e-mail, sem conta, sem senha. Privacidade de verdade.",
    iconColor:   "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
  {
    icon:        Smartphone,
    title:       "100% Responsivo",
    description: "Experiência idêntica em qualquer dispositivo, do celular ao ultrawide.",
    iconColor:   "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
  },
  {
    icon:        RefreshCw,
    title:       "Sempre Atualizado",
    description: "Novas ferramentas e artigos toda semana. Sugestões da comunidade são bem-vindas.",
    iconColor:   "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
  },
  {
    icon:        Accessibility,
    title:       "Acessível",
    description: "Segue WCAG 2.1 AA. Compatível com leitores de tela e navegação por teclado.",
    iconColor:   "bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400",
  },
  {
    icon:        GitBranch,
    title:       "Código Aberto",
    description: "Transparência total. Inspecione, contribua ou faça seu próprio fork no GitHub.",
    iconColor:   "bg-muted text-foreground",
  },
]

export function BenefitsSection() {
  return (
    <Section spacing="default" background="muted">
      <Container>
        {/* Header */}
        <AnimateIn variant="fadeInUp" className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Por que usar
          </div>
          <Heading as="h2" size="xl" align="center" className="mb-4">
            Construído para ser usado, não vendido
          </Heading>
          <p className="mx-auto max-w-lg leading-relaxed text-muted-foreground">
            Cada decisão de produto foi pensada para quem está focado em
            produzir, não em preencher formulários.
          </p>
        </AnimateIn>

        {/* Grid */}
        <StaggerIn className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <StaggerChild key={benefit.title}>
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-soft transition-all duration-200 hover:shadow-card hover:border-border/70">
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${benefit.iconColor}`}
                >
                  <benefit.icon className="size-5" aria-hidden />
                </div>
                <div>
                  <h3 className="mb-1.5 font-heading font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </StaggerChild>
          ))}
        </StaggerIn>
      </Container>
    </Section>
  )
}
