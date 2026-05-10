import { z } from "zod"

import type { ToolConfig, ToolMeta } from "@/types/tools"

// ─── Schema ──────────────────────────────────────────────────────────────────

export const compoundInterestSchema = z
  .object({
    principal: z
      .number()
      .min(0, "O valor deve ser ≥ 0")
      .max(1_000_000_000, "Máximo: R$ 1 bilhão"),
    monthlyContribution: z
      .number()
      .min(0, "O aporte deve ser ≥ 0")
      .max(1_000_000, "Máximo: R$ 1 milhão/mês"),
    rate: z
      .number()
      .positive("A taxa deve ser maior que zero")
      .max(1000, "Máximo: 1000%"),
    periods: z
      .number()
      .int("Deve ser um número inteiro")
      .min(1, "Mínimo: 1 período")
      .max(600, "Máximo: 600 períodos"),
    periodType: z.enum(["monthly", "annual"]),
  })
  .refine(data => data.principal > 0 || data.monthlyContribution > 0, {
    message: "Informe ao menos o aporte inicial ou o aporte mensal",
    path: ["principal"],
  })

export type CompoundInterestInput = z.infer<typeof compoundInterestSchema>

// ─── Data shapes ─────────────────────────────────────────────────────────────

/** Snapshot at the end of each month */
export interface PeriodSnapshot {
  period:     number  // month index, 1-based
  year:       number  // 1-based
  balance:    number
  invested:   number  // cumulative total invested
  interest:   number  // cumulative interest (= balance - invested)
  earnedThis: number  // interest earned in this specific month
}

/** Aggregated view of each calendar year */
export interface YearSummary {
  year:         number
  balance:      number  // end-of-year balance
  invested:     number  // cumulative invested
  interest:     number  // cumulative interest
  yearContrib:  number  // contributed this year
  yearInterest: number  // interest earned this year
}

export interface CompoundInterestResult {
  finalAmount:          number
  totalInvested:        number
  totalInterest:        number
  totalReturn:          number  // %
  effectiveMonthlyRate: number  // %
  effectiveAnnualRate:  number  // %
  monthlyPeriods:       PeriodSnapshot[]
  yearSummaries:        YearSummary[]
}

// ─── Engine ───────────────────────────────────────────────────────────────────

/**
 * Iterative month-by-month compound interest with regular contributions.
 *   balance[m] = balance[m-1] × (1 + r) + PMT
 *   invested[m] = P + PMT × m
 * Contributions are end-of-period (ordinary annuity).
 */
export function computeCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, monthlyContribution, rate, periods, periodType } = input

  // Convert to monthly basis
  let r: number  // monthly rate (decimal)
  let n: number  // total months

  if (periodType === "annual") {
    r = Math.pow(1 + rate / 100, 1 / 12) - 1
    n = periods * 12
  } else {
    r = rate / 100
    n = periods
  }

  const effectiveAnnualRate = (Math.pow(1 + r, 12) - 1) * 100

  // Build monthly series
  const monthlyPeriods: PeriodSnapshot[] = []
  let balance  = principal
  let invested = principal

  for (let m = 1; m <= n; m++) {
    const earnedThis = balance * r
    balance  = balance * (1 + r) + monthlyContribution
    invested = principal + monthlyContribution * m
    monthlyPeriods.push({
      period:     m,
      year:       Math.ceil(m / 12),
      balance,
      invested,
      interest:   balance - invested,
      earnedThis,
    })
  }

  // Build yearly aggregates
  const totalYears = Math.ceil(n / 12)
  const yearSummaries: YearSummary[] = []
  let prevInvested = 0
  let prevInterest = 0

  for (let y = 1; y <= totalYears; y++) {
    const idx  = Math.min(y * 12, n) - 1
    const snap = monthlyPeriods[idx]
    yearSummaries.push({
      year:         y,
      balance:      snap.balance,
      invested:     snap.invested,
      interest:     snap.interest,
      yearContrib:  snap.invested - prevInvested,
      yearInterest: snap.interest - prevInterest,
    })
    prevInvested = snap.invested
    prevInterest = snap.interest
  }

  const last          = monthlyPeriods[monthlyPeriods.length - 1]
  const totalInvested = last.invested
  const totalInterest = last.interest

  return {
    finalAmount:          last.balance,
    totalInvested,
    totalInterest,
    totalReturn:          totalInvested > 0 ? (totalInterest / totalInvested) * 100 : 0,
    effectiveMonthlyRate: r * 100,
    effectiveAnnualRate,
    monthlyPeriods,
    yearSummaries,
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const compoundInterestMeta: ToolMeta = {
  id:   "compound-interest",
  slug: "juros-compostos",
  name: "Calculadora de Juros Compostos",
  description:
    "Simule o crescimento do seu patrimônio com juros compostos, aportes mensais e análise período a período.",
  longDescription:
    "Calcule com precisão o crescimento de investimentos com juros compostos. Defina aporte inicial, aporte mensal, taxa de juros e período para visualizar a evolução patrimonial mês a mês, com gráficos interativos e tabela detalhada.",
  icon:     "📈",
  category: "financeiro",
  tier:     "FREE",
  keywords: [
    "juros compostos",
    "calculadora de juros",
    "investimento",
    "aporte mensal",
    "taxa de juros",
    "montante final",
    "rendimento",
    "patrimônio",
  ],
  faqs: [
    {
      question: "O que são juros compostos?",
      answer:
        "Juros compostos incidem não só sobre o valor inicial, mas também sobre os juros acumulados — o famoso 'juros sobre juros'. São a base da maioria dos investimentos financeiros e o motivo pelo qual começar cedo faz tanta diferença.",
    },
    {
      question: "Qual a diferença entre taxa mensal e anual?",
      answer:
        "Não é simples multiplicar ou dividir por 12. A conversão correta é: taxa mensal = (1 + taxa anual)^(1/12) − 1. Esta calculadora faz essa conversão automaticamente.",
    },
    {
      question: "Como funciona o aporte mensal?",
      answer:
        "A cada mês, o aporte é somado ao saldo após a incidência dos juros. A fórmula usada é: saldo[m] = saldo[m-1] × (1 + r) + aporte.",
    },
    {
      question: "Os resultados consideram inflação e impostos?",
      answer:
        "Não. Os valores são nominais, sem descontar inflação (IPCA) nem Imposto de Renda. Para análise completa, considere subtrair o IR e deflacionar pelo IPCA do período.",
    },
  ],
}

export const compoundInterestConfig: ToolConfig<CompoundInterestInput, CompoundInterestResult> = {
  ...compoundInterestMeta,
  schema:  compoundInterestSchema,
  compute: computeCompoundInterest,
}
