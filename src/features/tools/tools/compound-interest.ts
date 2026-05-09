import { z } from "zod"

import type { ToolConfig, ToolMeta } from "@/types/tools"

// ─── Schema ──────────────────────────────────────────────────────────────────

export const compoundInterestSchema = z.object({
  principal: z
    .number()
    .positive("O valor deve ser positivo")
    .max(1_000_000_000, "Valor máximo: R$ 1 bilhão"),
  rate: z
    .number()
    .positive("A taxa deve ser positiva")
    .max(1000, "Taxa máxima: 1000%"),
  periods: z
    .number()
    .int("Deve ser número inteiro")
    .positive("Deve ser positivo")
    .max(600, "Máximo de 600 períodos"),
  periodType: z.enum(["monthly", "annual"]),
})

export type CompoundInterestInput = z.infer<typeof compoundInterestSchema>

// ─── Output ──────────────────────────────────────────────────────────────────

export interface CompoundInterestResult {
  finalAmount:   number
  totalInterest: number
  totalReturn:   number  // percentage, e.g. 45.32
  monthlyRate:   number  // effective monthly rate
}

// ─── Compute ─────────────────────────────────────────────────────────────────

export function computeCompoundInterest(
  input: CompoundInterestInput,
): CompoundInterestResult {
  const { principal, rate, periods, periodType } = input
  const r           = rate / 100
  const finalAmount = principal * Math.pow(1 + r, periods)
  const totalInterest = finalAmount - principal
  const totalReturn   = (totalInterest / principal) * 100

  // Effective monthly rate — convert annual if needed
  const monthlyRate =
    periodType === "annual" ? (Math.pow(1 + r, 1 / 12) - 1) * 100 : rate

  return { finalAmount, totalInterest, totalReturn, monthlyRate }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const compoundInterestMeta: ToolMeta = {
  id:   "compound-interest",
  slug: "juros-compostos",
  name: "Calculadora de Juros Compostos",
  description:
    "Calcule o crescimento do seu capital com a fórmula de juros compostos.",
  longDescription:
    "Simule o crescimento de investimentos com juros compostos. Informe o valor inicial, a taxa de juros e o número de períodos para ver o montante final, os juros acumulados e a rentabilidade total.",
  icon:     "📈",
  category: "financeiro",
  tier:     "FREE",
  keywords: [
    "juros compostos",
    "calculadora de juros",
    "investimento",
    "taxa de juros",
    "montante final",
    "rendimento",
  ],
  faqs: [
    {
      question: "O que são juros compostos?",
      answer:
        "Juros compostos são aqueles que incidem não apenas sobre o valor inicial (principal), mas também sobre os juros acumulados de períodos anteriores — o chamado 'juros sobre juros'. São a base da maioria dos investimentos financeiros.",
    },
    {
      question: "Qual a diferença entre taxa mensal e anual?",
      answer:
        "A taxa mensal é aplicada a cada mês, enquanto a taxa anual é aplicada a cada ano. Elas não se convertem simplesmente multiplicando ou dividindo por 12: a taxa mensal equivalente a uma taxa anual de X% é (1 + X/100)^(1/12) − 1.",
    },
    {
      question: "Como a calculadora faz o cálculo?",
      answer:
        "Usamos a fórmula clássica M = P × (1 + r)^n, onde M é o montante final, P é o principal, r é a taxa por período (em decimal) e n é o número de períodos.",
    },
    {
      question: "Os resultados consideram inflação e impostos?",
      answer:
        "Não. Os cálculos mostram o valor nominal, sem descontar inflação (IPCA) nem imposto de renda. Para uma análise completa, subtraia os impostos devidos e deflate pelo IPCA do período.",
    },
  ],
}

// ─── Full config (imported by form components) ────────────────────────────────

export const compoundInterestConfig: ToolConfig<
  CompoundInterestInput,
  CompoundInterestResult
> = {
  ...compoundInterestMeta,
  schema:  compoundInterestSchema,
  compute: computeCompoundInterest,
}
