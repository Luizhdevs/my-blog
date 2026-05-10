"use client"

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

/** Downsample to at most maxPoints while always keeping the last point */
function sample(periods: PeriodSnapshot[], maxPoints = 120): PeriodSnapshot[] {
  if (periods.length <= maxPoints) return periods
  const step    = Math.ceil(periods.length / maxPoints)
  const sampled = periods.filter((_, i) => (i + 1) % step === 0)
  const last    = periods[periods.length - 1]
  if (sampled[sampled.length - 1]?.period !== last.period) sampled.push(last)
  return sampled
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const invested = payload.find(p => p.dataKey === "invested")?.value ?? 0
  const interest = payload.find(p => p.dataKey === "interest")?.value ?? 0
  const balance  = invested + interest

  return (
    <div
      role="tooltip"
      className="min-w-[180px] rounded-xl border border-border bg-popover px-4 py-3 shadow-lg text-sm"
    >
      <p className="mb-2 font-semibold text-foreground">{label}</p>
      <dl className="flex flex-col gap-1">
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">Investido</dt>
          <dd className="tabular-nums font-medium text-foreground">{fmtBRL(invested)}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">Juros</dt>
          <dd className="tabular-nums font-medium text-emerald-600 dark:text-emerald-400">{fmtBRL(interest)}</dd>
        </div>
        <div className="mt-1 flex justify-between gap-6 border-t border-border pt-1">
          <dt className="font-semibold text-foreground">Patrimônio</dt>
          <dd className="tabular-nums font-bold text-primary">{fmtBRL(balance)}</dd>
        </div>
      </dl>
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

interface EvolutionChartProps {
  data:         PeriodSnapshot[]
  totalMonths:  number
}

export function EvolutionChart({ data, totalMonths }: EvolutionChartProps) {
  const points = sample(data)

  const chartData = points.map(p => ({
    label:    totalMonths > 24
                ? `${p.year}º ano`
                : `Mês ${p.period}`,
    invested: p.invested,
    interest: p.interest,
    period:   p.period,
  }))

  // Show every n-th tick label so the axis isn't crowded
  const tickCount = Math.min(chartData.length, totalMonths > 60 ? 6 : 12)
  const step      = Math.max(1, Math.floor(chartData.length / tickCount))

  const tickFormatter = (_: unknown, index: number) => {
    if (index % step !== 0 && index !== chartData.length - 1) return ""
    return chartData[index]?.label ?? ""
  }

  return (
    <section
      aria-label="Gráfico de evolução patrimonial"
      className="rounded-2xl border border-border bg-card p-5 shadow-soft"
    >
      <h3 className="mb-1 font-heading text-base font-semibold text-foreground">
        Evolução Patrimonial
      </h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Patrimônio acumulado ao longo do tempo, separado por investido e juros
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />

          <XAxis
            dataKey="label"
            tickFormatter={tickFormatter}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtAxis}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            width={72}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            formatter={(value: string) =>
              value === "invested" ? "Investido" : "Juros"
            }
            wrapperStyle={{ fontSize: "12px" }}
          />

          <Area
            type="monotone"
            dataKey="invested"
            stackId="a"
            stroke="#3B82F6"
            strokeWidth={1.5}
            fill="url(#gradInvested)"
          />
          <Area
            type="monotone"
            dataKey="interest"
            stackId="a"
            stroke="#10B981"
            strokeWidth={1.5}
            fill="url(#gradInterest)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  )
}
