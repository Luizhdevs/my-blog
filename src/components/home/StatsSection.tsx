import { AnimateIn, StaggerIn, StaggerChild } from "@/components/shared"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"

const stats = [
  {
    value:       "50+",
    label:       "Ferramentas disponíveis",
    description: "E crescendo toda semana",
  },
  {
    value:       "10k+",
    label:       "Usuários por mês",
    description: "Profissionais e estudantes",
  },
  {
    value:       "0",
    label:       "Dados coletados",
    description: "Privacidade total",
  },
  {
    value:       "100%",
    label:       "Gratuito",
    description: "Sempre, sem exceção",
  },
]

export function StatsSection() {
  return (
    <Section
      spacing="default"
      className="relative overflow-hidden bg-[oklch(0.115_0.018_213)] text-white"
    >
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <AnimateIn variant="fadeInUp" className="mb-12 text-center">
          <Heading as="h2" size="xl" align="center" textColor="white" className="mb-4">
            Números que falam por si
          </Heading>
          <p className="mx-auto max-w-lg leading-relaxed text-white/65">
            Métricas de uma plataforma focada em entregar valor real,
            sem strings attached.
          </p>
        </AnimateIn>

        <StaggerIn className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StaggerChild key={stat.label}>
              <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-7 text-center backdrop-blur-sm">
                {/* Accent mark */}
                <span
                  className="mb-4 block h-0.5 w-8 rounded-full bg-primary/60"
                  aria-hidden
                />
                <span className="font-heading text-4xl font-bold tabular-nums text-white sm:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm font-semibold text-white/85">
                  {stat.label}
                </span>
                <span className="mt-1 text-xs text-white/50">{stat.description}</span>
              </div>
            </StaggerChild>
          ))}
        </StaggerIn>
      </Container>
    </Section>
  )
}
