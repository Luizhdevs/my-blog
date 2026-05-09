import Link from "next/link"
import {
  ArrowRight,
  Calculator,
  ArrowLeftRight,
  Palette,
  TrendingUp,
  Code2,
  Scale,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { AnimateIn, StaggerIn, StaggerChild } from "@/components/shared"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Tool {
  icon:        LucideIcon
  title:       string
  description: string
  category:    string
  href:        string
  badge?:      string
  iconColor:   string
}

const featuredTools: Tool[] = [
  {
    icon:        Calculator,
    title:       "Calculadora de Financiamento",
    description: "Simule parcelas, juros e custo total de financiamentos imobiliários e veiculares.",
    category:    "Financeiro",
    href:        "/ferramentas/financeiro/financiamento",
    badge:       "Popular",
    iconColor:   "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
  },
  {
    icon:        TrendingUp,
    title:       "Juros Compostos",
    description: "Calcule o crescimento de investimentos com juros compostos e rendimento acumulado.",
    category:    "Financeiro",
    href:        "/ferramentas/financeiro/juros-compostos",
    iconColor:   "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
  {
    icon:        ArrowLeftRight,
    title:       "Conversor de Unidades",
    description: "Converta comprimento, peso, temperatura, área e volume com precisão.",
    category:    "Conversores",
    href:        "/ferramentas/conversores/unidades",
    iconColor:   "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
  },
  {
    icon:        Palette,
    title:       "Paleta de Cores",
    description: "Gere e converta cores entre HEX, RGB, HSL e OKLCH. Visualize contrastes de acessibilidade.",
    category:    "Web",
    href:        "/ferramentas/web/paleta-cores",
    iconColor:   "bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400",
  },
  {
    icon:        Code2,
    title:       "Formatador de JSON",
    description: "Formate, valide e minifique JSON. Identação automática e detecção de erros de sintaxe.",
    category:    "Web",
    href:        "/ferramentas/web/formatador-json",
    iconColor:   "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  },
  {
    icon:        Scale,
    title:       "Calculadora de IMC",
    description: "Calcule o índice de massa corporal e veja a classificação segundo a OMS.",
    category:    "Matemática",
    href:        "/ferramentas/matematica/imc",
    iconColor:   "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400",
  },
]

export function ToolsPreview() {
  return (
    <Section spacing="default" background="muted">
      <Container>
        {/* Header */}
        <AnimateIn variant="fadeInUp" className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Ferramentas
          </div>
          <Heading as="h2" size="xl" align="center" className="mb-4">
            Tudo que você precisa, em um só lugar
          </Heading>
          <p className="mx-auto max-w-lg leading-relaxed text-muted-foreground">
            Ferramentas gratuitas e precisas para o seu dia a dia.
            Sem anúncios, sem cadastro.
          </p>
        </AnimateIn>

        {/* Grid */}
        <StaggerIn className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <StaggerChild key={tool.href}>
              <Link
                href={tool.href}
                className="group flex h-full flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/15 hover:shadow-elevated focus-visible:outline-2 focus-visible:outline-ring"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${tool.iconColor}`}
                  >
                    <tool.icon className="size-5" aria-hidden />
                  </div>
                  {tool.badge && (
                    <Badge variant="secondary" className="text-[10px]">
                      {tool.badge}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary/70">
                    {tool.category}
                  </p>
                  <h3 className="mb-2 font-heading font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">
                    {tool.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>

                <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Usar ferramenta
                  <ArrowRight
                    className="size-3.5 transition-transform duration-150 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </StaggerChild>
          ))}
        </StaggerIn>

        {/* Footer CTA */}
        <AnimateIn variant="fadeInUp" delay={0.2} className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/ferramentas">
              Ver todas as ferramentas
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </AnimateIn>
      </Container>
    </Section>
  )
}
