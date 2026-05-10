"use client"

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber"
import { cn }                from "@/lib/utils"
import type { CompoundInterestResult } from "@/features/tools/tools/compound-interest"

// ─── Formatters ──────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

const fmtPct = (decimals: number) => (v: number) =>
  `${v.toFixed(decimals)}%`

// ─── AnimatedValue ────────────────────────────────────────────────────────────

interface AnimatedValueProps {
  value:     number
  format:    (n: number) => string
  className?: string
}

function AnimatedValue({ value, format, className }: AnimatedValueProps) {
  const animated = useAnimatedNumber(value)
  return <span className={className}>{format(animated)}</span>
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  label:      string
  value:      number
  format:     (n: number) => string
  highlight?: boolean
  variant?:   "default" | "positive" | "neutral"
  className?: string
}

function Card({ label, value, format, highlight, variant = "default", className }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-xl border p-4 transition-colors",
        highlight
          ? "border-primary/25 bg-primary/5"
          : variant === "positive"
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-border bg-muted/30",
        className,
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <AnimatedValue
        value={value}
        format={format}
        className={cn(
          "font-heading text-xl font-bold tabular-nums leading-tight sm:text-2xl",
          highlight
            ? "text-primary"
            : variant === "positive"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-foreground",
        )}
      />
    </div>
  )
}

// ─── SummaryCards ─────────────────────────────────────────────────────────────

interface SummaryCardsProps {
  result: CompoundInterestResult
}

export function SummaryCards({ result }: SummaryCardsProps) {
  return (
    <section aria-label="Resumo financeiro">
      {/* Hero card */}
      <Card
        label="Montante Final"
        value={result.finalAmount}
        format={fmtBRL}
        highlight
        className="mb-3 p-5"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card
          label="Total Investido"
          value={result.totalInvested}
          format={fmtBRL}
        />
        <Card
          label="Juros Acumulados"
          value={result.totalInterest}
          format={fmtBRL}
          variant="positive"
        />
        <Card
          label="Rentabilidade"
          value={result.totalReturn}
          format={fmtPct(2)}
          variant="positive"
          className="col-span-2 sm:col-span-1"
        />
        <Card
          label="Taxa Mensal Ef."
          value={result.effectiveMonthlyRate}
          format={fmtPct(4)}
        />
        <Card
          label="Taxa Anual Ef."
          value={result.effectiveAnnualRate}
          format={fmtPct(2)}
        />
      </div>
    </section>
  )
}
