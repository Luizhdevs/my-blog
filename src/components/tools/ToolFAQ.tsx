import type { FAQItem } from "@/types/tools"
import { FAQAccordion } from "@/components/home/FAQAccordion"
import { Section } from "@/components/shared/Section"
import { Container } from "@/components/shared/Container"

interface ToolFAQProps {
  faqs: FAQItem[]
}

export function ToolFAQ({ faqs }: ToolFAQProps) {
  if (faqs.length === 0) return null

  return (
    <Section spacing="default" background="muted">
      <Container size="md">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground text-sm">
            Dúvidas sobre esta ferramenta
          </p>
        </div>
        <FAQAccordion items={faqs} />
      </Container>
    </Section>
  )
}
