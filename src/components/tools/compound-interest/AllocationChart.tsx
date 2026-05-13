"use client"

import { memo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import type { YearSummary } from "@/features/tools/tools/compound-interest"

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

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const invested    = payload.find(p => p.dataKey === "invested")?.value ?? 0
  const interest    = payload.find(p => p.dataKey === "interest")?.value ?? 0
  const total       = invested + interest
  const interestPct = total > 0 ? ((interest / total) * 100).toFixed(1) : "0"

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
          <dd className="tabular-nums font-bold text-primary">{fmtBRL(total)}</dd>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {interestPct}% do patrimônio é rendimento
        </p>
      </dl>
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

interface AllocationChartProps {
  data: YearSummary[]
}

export const AllocationChart = memo(function AllocationChart({ data }: AllocationChartProps) {
  const chartData = data.map(y => ({
    label:    `${y.year}º`,
    invested: y.invested,
    interest: y.interest,
  }))

  return (
    <section
      aria-label="Gráfico de composição patrimonial por ano"
      className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5"
    >
      <div className="mb-3 sm:mb-4">
        <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">
          Composição Patrimonial
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Capital investido vs juros acumulados ao final de cada ano
        </p>
      </div>

      {/* Responsive height: 180px mobile → 220px sm → 260px lg */}
      <div className="h-[180px] sm:h-[220px] lg:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              interval="preserveStartEnd"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
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
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            />
            <Legend
              formatter={(value: string) =>
                value === "invested" ? "Capital Investido" : "Juros"
              }
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
            <Bar
              dataKey="invested"
              stackId="a"
              fill="#3B82F6"
              radius={[0, 0, 3, 3]}
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="interest"
              stackId="a"
              fill="#10B981"
              radius={[3, 3, 0, 0]}
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
})
