import { AnimateIn } from "@/components/shared"
import { Container } from "@/components/shared/Container"
import { Heading } from "@/components/shared/Heading"
import { Section } from "@/components/shared/Section"
import { FAQAccordion, type FAQItem } from "./FAQAccordion"

const faqs: FAQItem[] = [
  {
    question: "As ferramentas são realmente gratuitas?",
    answer:
      "Sim, 100% gratuitas. Não há plano pago, não há limite de uso e não há recursos bloqueados. A plataforma é mantida com paixão pela tecnologia e conteúdo de qualidade.",
  },
  {
    question: "Preciso criar uma conta para usar?",
    answer:
      "Não. Todas as ferramentas funcionam imediatamente, sem cadastro, sem e-mail e sem senha. Sua privacidade é uma prioridade — nenhum dado pessoal é coletado.",
  },
  {
    question: "Com que frequência novas ferramentas são adicionadas?",
    answer:
      "Tentamos adicionar pelo menos uma nova ferramenta por semana. Sugestões da comunidade são muito bem-vindas — use o formulário de contato para nos enviar suas ideias.",
  },
  {
    question: "As ferramentas funcionam offline?",
    answer:
      "A maioria das ferramentas executa todo o processamento no lado do cliente (browser), sem enviar dados para servidores. Uma vez carregada a página, muitas delas funcionam sem conexão ativa.",
  },
  {
    question: "Posso usar as ferramentas no ambiente corporativo?",
    answer:
      "Sim. As ferramentas são de uso livre, incluindo ambientes comerciais e corporativos. Consulte nossa página de Termos de Uso para os detalhes completos da licença.",
  },
  {
    question: "Como posso reportar um bug ou sugerir uma melhoria?",
    answer:
      "Você pode abrir uma issue diretamente no repositório GitHub do projeto ou usar o formulário de contato. Feedbacks são levados muito a sério e costumam ser implementados rapidamente.",
  },
]

export function FAQSection() {
  return (
    <Section spacing="default" background="muted">
      <Container size="md">
        <AnimateIn variant="fadeInUp" className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            FAQ
          </div>
          <Heading as="h2" size="xl" align="center" className="mb-4">
            Perguntas Frequentes
          </Heading>
          <p className="mx-auto max-w-lg leading-relaxed text-muted-foreground">
            Tudo que você precisa saber antes de começar.
          </p>
        </AnimateIn>

        <AnimateIn variant="fadeInUp" delay={0.1}>
          <FAQAccordion items={faqs} />
        </AnimateIn>
      </Container>
    </Section>
  )
}
