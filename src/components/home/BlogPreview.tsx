import Link from "next/link"
import { ArrowRight, BookOpen, Clock } from "lucide-react"

import { AnimateIn, StaggerIn, StaggerChild } from "@/components/shared"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Article {
  slug:        string
  title:       string
  excerpt:     string
  category:    string
  readingTime: number
  date:        string
  dateISO:     string
  gradient:    string
  accentColor: string
}

const featuredArticles: Article[] = [
  {
    slug:        "nextjs-performance-tips",
    title:       "10 Técnicas de Performance no Next.js que Você Precisa Conhecer",
    excerpt:
      "Da otimização de imagens ao cache granular com React Server Components — um guia completo para deixar sua aplicação Next.js rápida de verdade.",
    category:    "Next.js",
    readingTime: 8,
    date:        "15 de abril de 2025",
    dateISO:     "2025-04-15",
    gradient:    "from-blue-500/25 to-cyan-500/25",
    accentColor: "bg-blue-500",
  },
  {
    slug:        "typescript-utility-types-2025",
    title:       "TypeScript Avançado: Tipos Utilitários que Mudam Como Você Coda",
    excerpt:
      "Explore Mapped Types, Template Literal Types e os novos utilitários do TypeScript 5.x com exemplos práticos do mundo real.",
    category:    "TypeScript",
    readingTime: 6,
    date:        "2 de abril de 2025",
    dateISO:     "2025-04-02",
    gradient:    "from-violet-500/25 to-purple-500/25",
    accentColor: "bg-violet-500",
  },
  {
    slug:        "tailwind-v4-migration",
    title:       "Tailwind CSS v4 — O Que Mudou e Como Migrar Seu Projeto",
    excerpt:
      "Configuração baseada em CSS, engine de alta performance e nova API de temas. Guia prático de migração do v3 para o v4.",
    category:    "CSS",
    readingTime: 5,
    date:        "20 de março de 2025",
    dateISO:     "2025-03-20",
    gradient:    "from-teal-500/25 to-emerald-500/25",
    accentColor: "bg-teal-500",
  },
]

export function BlogPreview() {
  return (
    <Section spacing="default">
      <Container>
        {/* Header */}
        <AnimateIn variant="fadeInUp" className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Blog
          </div>
          <Heading as="h2" size="xl" align="center" className="mb-4">
            Conteúdo técnico de qualidade
          </Heading>
          <p className="mx-auto max-w-lg leading-relaxed text-muted-foreground">
            Artigos aprofundados sobre desenvolvimento web, performance e as
            melhores ferramentas do ecossistema JavaScript.
          </p>
        </AnimateIn>

        {/* Cards */}
        <StaggerIn className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredArticles.map((article) => (
            <StaggerChild key={article.slug} className="flex flex-col">
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden" aria-hidden>
                  {/* Top accent line */}
                  <div className={`absolute inset-x-0 top-0 z-10 h-0.5 ${article.accentColor}`} />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${article.gradient} flex items-center justify-center`}
                  >
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm shadow-soft">
                      <BookOpen className="size-6 text-primary" aria-hidden />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {article.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" aria-hidden />
                      {article.readingTime} min de leitura
                    </span>
                  </div>

                  <div className="flex-1">
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="font-heading font-semibold leading-snug text-foreground transition-colors duration-150 group-hover:text-primary line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <time
                      dateTime={article.dateISO}
                      className="text-xs text-muted-foreground"
                    >
                      {article.date}
                    </time>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Ler artigo
                      <ArrowRight
                        className="size-3 transition-transform duration-150 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>
              </article>
            </StaggerChild>
          ))}
        </StaggerIn>

        {/* Footer CTA */}
        <AnimateIn variant="fadeInUp" delay={0.2} className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/blog">
              Ver todos os artigos
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </AnimateIn>
      </Container>
    </Section>
  )
}
