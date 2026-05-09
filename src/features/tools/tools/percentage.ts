import { z } from "zod"

import type { ToolConfig, ToolMeta } from "@/types/tools"

// ─── Mode definitions ────────────────────────────────────────────────────────

export const PERCENTAGE_MODES = [
  { id: "percent-of",       label: "X% de Y",      hint: "Quanto é X% de Y?" },
  { id: "percent-change",   label: "Variação %",   hint: "Variação percentual de X para Y" },
  { id: "what-percent",     label: "X é % de Y",   hint: "X representa qual % de Y?" },
  { id: "add-percent",      label: "Adicionar %",  hint: "Adicionar X% a Y" },
  { id: "subtract-percent", label: "Subtrair %",   hint: "Subtrair X% de Y" },
] as const

export type PercentageMode = (typeof PERCENTAGE_MODES)[number]["id"]

// ─── Schema ──────────────────────────────────────────────────────────────────

export const percentageSchema = z.object({
  mode: z.enum([
    "percent-of",
    "percent-change",
    "what-percent",
    "add-percent",
    "subtract-percent",
  ]),
  valueA: z.number(),
  valueB: z.number(),
})

export type PercentageInput = z.infer<typeof percentageSchema>

// ─── Output ──────────────────────────────────────────────────────────────────

export interface PercentageResult {
  result:      number
  explanation: string
  isPercent:   boolean
}

// ─── Compute ─────────────────────────────────────────────────────────────────

export function computePercentage({
  mode,
  valueA,
  valueB,
}: PercentageInput): PercentageResult {
  const fmtNum = (n: number) =>
    n.toLocaleString("pt-BR", { maximumFractionDigits: 4 })

  switch (mode) {
    case "percent-of": {
      const result = (valueA / 100) * valueB
      return {
        result,
        explanation: `${fmtNum(valueA)}% de ${fmtNum(valueB)} é ${fmtNum(result)}`,
        isPercent: false,
      }
    }
    case "percent-change": {
      if (valueA === 0)
        return { result: 0, explanation: "Valor inicial não pode ser zero", isPercent: true }
      const result    = ((valueB - valueA) / Math.abs(valueA)) * 100
      const direction = result >= 0 ? "aumento" : "redução"
      return {
        result,
        explanation: `De ${fmtNum(valueA)} para ${fmtNum(valueB)}: ${direction} de ${fmtNum(Math.abs(result))}%`,
        isPercent: true,
      }
    }
    case "what-percent": {
      if (valueB === 0)
        return { result: 0, explanation: "Valor total não pode ser zero", isPercent: true }
      const result = (valueA / valueB) * 100
      return {
        result,
        explanation: `${fmtNum(valueA)} representa ${fmtNum(result)}% de ${fmtNum(valueB)}`,
        isPercent: true,
      }
    }
    case "add-percent": {
      const result = valueB + (valueA / 100) * valueB
      return {
        result,
        explanation: `${fmtNum(valueB)} + ${fmtNum(valueA)}% = ${fmtNum(result)}`,
        isPercent: false,
      }
    }
    case "subtract-percent": {
      const result = valueB - (valueA / 100) * valueB
      return {
        result,
        explanation: `${fmtNum(valueB)} − ${fmtNum(valueA)}% = ${fmtNum(result)}`,
        isPercent: false,
      }
    }
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const percentageMeta: ToolMeta = {
  id:   "percentage",
  slug: "calculadora-porcentagem",
  name: "Calculadora de Porcentagem",
  description:
    "Calcule porcentagens, variações percentuais e proporções em segundos.",
  longDescription:
    "Calculadora completa com 5 modos: descubra quanto é X% de Y, a variação percentual entre dois valores, que porcentagem X representa de Y, e adicione ou subtraia percentuais de qualquer valor.",
  icon:     "%",
  category: "matematica",
  tier:     "FREE",
  keywords: [
    "calculadora de porcentagem",
    "percentual",
    "variação percentual",
    "desconto",
    "cálculo de porcentagem",
  ],
  faqs: [
    {
      question: "Como calcular porcentagem de um valor?",
      answer:
        "Use a fórmula (X ÷ 100) × Y. Por exemplo, 15% de R$ 200 = (15 ÷ 100) × 200 = R$ 30.",
    },
    {
      question: "Como calcular variação percentual?",
      answer:
        "Variação % = ((Novo − Antigo) ÷ |Antigo|) × 100. Resultado positivo = aumento; negativo = redução.",
    },
    {
      question: "Como saber que % um valor representa de outro?",
      answer:
        "Divida o valor parcial pelo total e multiplique por 100: (X ÷ Y) × 100. Exemplo: 30 é (30 ÷ 200) × 100 = 15% de 200.",
    },
    {
      question: "Como adicionar ou subtrair uma porcentagem?",
      answer:
        "Para adicionar X% a Y: Y + (X/100 × Y) = Y × (1 + X/100). Para subtrair: Y × (1 − X/100).",
    },
  ],
}

export const percentageConfig: ToolConfig<PercentageInput, PercentageResult> = {
  ...percentageMeta,
  schema:  percentageSchema,
  compute: computePercentage,
}
