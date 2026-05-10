"use client"

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

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const invested = payload.find(p => p.dataKey === "invested")?.value ?? 0
  const interest = payload.find(p => p.dataKey === "interest")?.value ?? 0

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
          <dt className="font-semibold text-foreground">Total</dt>
          <dd className="tabular-nums font-bold text-primary">{fmtBRL(invested + interest)}</dd>
        </div>
      </dl>
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

interface AllocationChartProps {
  data: YearSummary[]
}

export function AllocationChart({ data }: AllocationChartProps) {
  const chartData = data.map(y => ({
    label:    `${y.year}º`,
    invested: y.invested,
    interest: y.interest,
  }))

  return (
    <section
      aria-label="Gráfico comparativo: aportes versus juros"
      className="rounded-2xl border border-border bg-card p-5 shadow-soft"
    >
      <h3 className="mb-1 font-heading text-base font-semibold text-foreground">
        Aportes vs Rendimentos
      </h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Composição do patrimônio ao final de cada ano: capital investido e juros acumulados
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />

          <XAxis
            dataKey="label"
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

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />

          <Legend
            formatter={(value: string) =>
              value === "invested" ? "Investido" : "Juros"
            }
            wrapperStyle={{ fontSize: "12px" }}
          />

          <Bar dataKey="invested" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
          <Bar dataKey="interest" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
