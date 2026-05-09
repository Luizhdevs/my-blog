import { z } from "zod"

import type { ToolConfig, ToolMeta } from "@/types/tools"

// ─── Currency definitions ─────────────────────────────────────────────────────

export const CURRENCIES = [
  { code: "BRL", name: "Real Brasileiro",   symbol: "R$",  flag: "🇧🇷" },
  { code: "USD", name: "Dólar Americano",   symbol: "$",   flag: "🇺🇸" },
  { code: "EUR", name: "Euro",              symbol: "€",   flag: "🇪🇺" },
  { code: "GBP", name: "Libra Esterlina",   symbol: "£",   flag: "🇬🇧" },
  { code: "JPY", name: "Iene Japonês",      symbol: "¥",   flag: "🇯🇵" },
  { code: "CAD", name: "Dólar Canadense",   symbol: "CA$", flag: "🇨🇦" },
  { code: "AUD", name: "Dólar Australiano", symbol: "A$",  flag: "🇦🇺" },
  { code: "CHF", name: "Franco Suíço",      symbol: "Fr",  flag: "🇨🇭" },
  { code: "CNY", name: "Yuan Chinês",       symbol: "¥",   flag: "🇨🇳" },
  { code: "MXN", name: "Peso Mexicano",     symbol: "MX$", flag: "🇲🇽" },
  { code: "ARS", name: "Peso Argentino",    symbol: "$",   flag: "🇦🇷" },
  { code: "CLP", name: "Peso Chileno",      symbol: "CL$", flag: "🇨🇱" },
  { code: "COP", name: "Peso Colombiano",   symbol: "CO$", flag: "🇨🇴" },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]["code"]

// Snapshot rates relative to USD — updated periodically
const RATES_USD: Record<CurrencyCode, number> = {
  BRL: 5.70,
  USD: 1.00,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 154.20,
  CAD: 1.36,
  AUD: 1.54,
  CHF: 0.90,
  CNY: 7.24,
  MXN: 17.05,
  ARS: 1015.00,
  CLP: 940.00,
  COP: 4120.00,
}

export const RATES_LAST_UPDATED = "Maio 2025"

// ─── Schema ──────────────────────────────────────────────────────────────────

export const currencySchema = z.object({
  amount: z
    .number()
    .positive("O valor deve ser positivo")
    .max(1_000_000_000, "Valor muito alto"),
  from: z.string().length(3),
  to:   z.string().length(3),
})

export type CurrencyInput = z.infer<typeof currencySchema>

// ─── Output ──────────────────────────────────────────────────────────────────

export interface CurrencyResult {
  result:      number
  rate:        number
  inverseRate: number
}

// ─── Compute ─────────────────────────────────────────────────────────────────

export function computeCurrency({ amount, from, to }: CurrencyInput): CurrencyResult {
  const fromRate = RATES_USD[from as CurrencyCode] ?? 1
  const toRate   = RATES_USD[to   as CurrencyCode] ?? 1
  const rate     = toRate / fromRate
  return {
    result:      amount * rate,
    rate,
    inverseRate: 1 / rate,
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const currencyMeta: ToolMeta = {
  id:   "currency",
  slug: "conversor-moedas",
  name: "Conversor de Moedas",
  description:
    "Converta entre as principais moedas do mundo com taxas de referência atualizadas.",
  longDescription:
    "Converta valores entre 13 moedas, incluindo Real, Dólar, Euro, Libra e outras. As taxas são atualizadas periodicamente. Para operações financeiras reais, consulte sempre o câmbio oficial do Banco Central.",
  icon:     "💱",
  category: "conversores",
  tier:     "FREE",
  keywords: [
    "conversor de moedas",
    "câmbio",
    "cotação",
    "dólar",
    "euro",
    "real",
    "taxa de câmbio",
  ],
  faqs: [
    {
      question: "As taxas são em tempo real?",
      answer:
        "As taxas são atualizadas periodicamente e servem como referência. Para operações financeiras reais, consulte o câmbio oficial do Banco Central do Brasil (bacen.gov.br).",
    },
    {
      question: "Quantas moedas estão disponíveis?",
      answer:
        "Atualmente oferecemos 13 moedas: BRL, USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, MXN, ARS, CLP e COP.",
    },
    {
      question: "Como é calculada a conversão?",
      answer:
        "A conversão usa o Dólar Americano (USD) como moeda base. Para converter A → B, calculamos (taxa de B em USD) ÷ (taxa de A em USD).",
    },
    {
      question: "Posso usar para declarar imposto de renda?",
      answer:
        "Não. Para conversão cambial oficial em declarações fiscais, use sempre a PTAX do Banco Central do Brasil.",
    },
  ],
}

export const currencyConfig: ToolConfig<CurrencyInput, CurrencyResult> = {
  ...currencyMeta,
  schema:  currencySchema,
  compute: computeCurrency,
}
