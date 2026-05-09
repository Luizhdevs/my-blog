import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"

import { getAllTools, getToolBySlug } from "@/features/tools"
import { ToolCTA } from "@/components/tools/ToolCTA"
import { ToolFAQ } from "@/components/tools/ToolFAQ"
import { ToolHeader } from "@/components/tools/ToolHeader"
import { CompoundInterestForm } from "@/components/tools/forms/CompoundInterestForm"
import { CurrencyForm } from "@/components/tools/forms/CurrencyForm"
import { PercentageForm } from "@/components/tools/forms/PercentageForm"
import { Container } from "@/components/shared/Container"
import { Section } from "@/components/shared/Section"
import { createMetadata } from "@/lib/metadata"
import { siteConfig } from "@/config/site"

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllTools().map(tool => ({ slug: tool.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}

  return createMetadata({
    title:       tool.name,
    description: tool.description,
    slug:        `ferramentas/${tool.slug}`,
    keywords:    tool.keywords,
  })
}

// ─── Form component map ───────────────────────────────────────────────────────

const TOOL_FORMS: Record<string, React.ComponentType> = {
  "juros-compostos":          CompoundInterestForm,
  "calculadora-porcentagem":  PercentageForm,
  "conversor-moedas":         CurrencyForm,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const FormComponent = TOOL_FORMS[slug]

  const jsonLd = {
    "@context":           "https://schema.org",
    "@type":              "WebApplication",
    name:                 tool.name,
    description:          tool.description,
    url:                  `${siteConfig.url}/ferramentas/${tool.slug}`,
    applicationCategory:  "UtilityApplication",
    operatingSystem:      "Web",
    inLanguage:           "pt-BR",
    offers: {
      "@type":       "Offer",
      price:         "0",
      priceCurrency: "BRL",
      availability:  "https://schema.org/InStock",
    },
  }

  return (
    <>
      <Script
        id={`jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <ToolHeader tool={tool} />

        <Section spacing="default">
          <Container size="md">
            {FormComponent ? (
              <FormComponent />
            ) : (
              <p className="text-muted-foreground">
                Esta ferramenta está em desenvolvimento.
              </p>
            )}
          </Container>
        </Section>

        <ToolFAQ faqs={tool.faqs} />
        <ToolCTA />
      </main>
    </>
  )
}
