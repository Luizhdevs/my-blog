"use client"

import { memo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import type { PeriodSnapshot } from "@/features/tools/tools/compound-interest"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartPayloadItem {
  dataKey?: string | number
  value?:   number
}

interface ChartTooltipProps {
  active?:  boolean
  payload?: ChartPayloadItem[]
  label?:   string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

const fmtAxis = (v: number) => {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `R$${(v / 1_000).toFixed(0)}K`
  return `R$${v.toFixed(0)}`
}

function sample(periods: PeriodSnapshot[], maxPoints = 120): PeriodSnapshot[] {
  if (periods.length <= maxPoints) return periods
  const step    = Math.ceil(periods.length / maxPoints)
  const sampled = periods.filter((_, i) => (i + 1) % step === 0)
  const last    = periods[periods.length - 1]
  if (sampled[sampled.length - 1]?.period !== last.period) sampled.push(last)
  return sampled
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const invested = payload.find(p => p.dataKey === "invested")?.value ?? 0
  const interest = payload.find(p => p.dataKey === "interest")?.value ?? 0
  const balance  = invested + interest

  return (
    <div
      role="tooltip"
      className="min-w-[180px] rounded-xl border border-border bg-popover px-3 py-2.5 shadow-xl text-sm sm:min-w-[190px] sm:px-4 sm:py-3"
    >
      <p className="mb-2 font-semibold text-foreground">{label}</p>
      <dl className="flex flex-col gap-1.5">
        <div className="flex justify-between gap-6">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 rounded-full bg-blue-500 shrink-0" />
            Investido
          </dt>
          <dd className="tabular-nums font-medium text-foreground">{fmtBRL(invested)}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
            Juros
          </dt>
          <dd className="tabular-nums font-medium text-emerald-600 dark:text-emerald-400">{fmtBRL(interest)}</dd>
        </div>
        <div className="mt-1 flex justify-between gap-6 border-t border-border pt-2">
          <dt className="font-semibold text-foreground">Total</dt>
          <dd className="tabular-nums font-bold text-primary">{fmtBRL(balance)}</dd>
        </div>
      </dl>
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

interface EvolutionChartProps {
  data:        PeriodSnapshot[]
  totalMonths: number
}

export const EvolutionChart = memo(function EvolutionChart({ data, totalMonths }: EvolutionChartProps) {
  const points   = sample(data)
  const longTerm = totalMonths > 24

  const chartData = points.map(p => ({
    label:    longTerm ? `${p.year}º ano` : `Mês ${p.period}`,
    invested: p.invested,
    interest: p.interest,
    period:   p.period,
  }))

  const maxLabels = totalMonths > 60 ? 6 : 10
  const step      = Math.max(1, Math.floor(chartData.length / maxLabels))

  const tickFormatter = (_: unknown, index: number) => {
    if (index % step !== 0 && index !== chartData.length - 1) return ""
    return chartData[index]?.label ?? ""
  }

  return (
    <section
      aria-label="Gráfico de evolução patrimonial"
      className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5"
    >
      <div className="mb-3 sm:mb-4">
        <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">
          Evolução Patrimonial
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Capital investido e juros acumulados ao longo do tempo
        </p>
      </div>

      {/* Responsive height: 220px mobile → 280px sm → 340px lg */}
      <div className="h-[220px] sm:h-[280px] lg:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.75} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10B981" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickFormatter={tickFormatter}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tickFormatter={fmtAxis}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1.5 }}
            />
            <Legend
              formatter={(value: string) =>
                value === "invested" ? "Capital Investido" : "Juros"
              }
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stackId="a"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#gradInvested)"
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="interest"
              stackId="a"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#gradInterest)"
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
})
