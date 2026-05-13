"use client"

import { memo }              from "react"
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber"
import { cn }                from "@/lib/utils"
import type { CompoundInterestResult } from "@/features/tools/tools/compound-interest"

// ─── Formatters ──────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

const fmtPct = (dec = 2) => (v: number) => `${v.toFixed(dec)}%`

// ─── AnimatedValue ────────────────────────────────────────────────────────────

interface AnimatedValueProps {
  value:      number
  format:     (n: number) => string
  className?: string
}

function AnimatedValue({ value, format, className }: AnimatedValueProps) {
  const n = useAnimatedNumber(value)
  return <span className={className}>{format(n)}</span>
}

// ─── HeroResult ───────────────────────────────────────────────────────────────

interface StatItem {
  label:     string
  value:     number
  format:    (v: number) => string
  positive?: boolean
}

interface HeroResultProps {
  result: CompoundInterestResult
}

export const HeroResult = memo(function HeroResult({ result }: HeroResultProps) {
  const investedPct = result.finalAmount > 0
    ? (result.totalInvested / result.finalAmount) * 100
    : 100

  const stats: StatItem[] = [
    { label: "Total Investido",  value: result.totalInvested,      format: fmtBRL },
    { label: "Juros Acumulados", value: result.totalInterest,      format: fmtBRL,    positive: true },
    { label: "Rentabilidade",    value: result.totalReturn,         format: fmtPct(2), positive: true },
    { label: "Taxa Anual Ef.",   value: result.effectiveAnnualRate, format: fmtPct(2) },
  ]

  return (
    <section
      aria-label="Resultado da simulação"
      className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    >
      {/* ── Hero number ───────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:mb-1.5">
          Montante Final
        </p>
        {/* break-all prevents overflow on extreme values (R$ 1T+); block makes it apply */}
        <AnimatedValue
          value={result.finalAmount}
          format={fmtBRL}
          className="block break-all font-heading text-2xl font-bold tabular-nums text-primary sm:text-3xl lg:text-5xl"
        />
      </div>

      {/* ── Proportion bar ────────────────────────────────────── */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-5">
        <div
          className="relative h-2.5 overflow-hidden rounded-full bg-border"
          role="img"
          aria-label={`${investedPct.toFixed(0)}% capital investido, ${(100 - investedPct).toFixed(0)}% juros`}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-l-full bg-blue-500 transition-[width] duration-700 ease-out"
            style={{ width: `${investedPct}%` }}
          />
          <div
            className="absolute inset-y-0 right-0 rounded-r-full bg-emerald-500 transition-[width] duration-700 ease-out"
            style={{ width: `${100 - investedPct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-500" aria-hidden="true" />
            Investido {investedPct.toFixed(0)}%
          </span>
          <span className="flex items-center gap-1.5">
            Juros {(100 - investedPct).toFixed(0)}%
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* ── Stats grid ────────────────────────────────────────────
          Mobile:  1-col list (label left / value right)
          sm:      2×2 card grid
          lg:      1×4 horizontal band                          */}
      <div className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="flex min-w-0 items-center justify-between gap-3 bg-card px-4 py-3 sm:flex-col sm:items-start sm:justify-start sm:gap-1"
          >
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </span>
            <AnimatedValue
              value={stat.value}
              format={stat.format}
              className={cn(
                "min-w-0 font-heading text-sm font-bold tabular-nums leading-tight",
                stat.positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-foreground",
              )}
            />
          </div>
        ))}
      </div>
    </section>
  )
})
