"use client"

import { useState } from "react"
import { cn }       from "@/lib/utils"
import type { DailyUsage } from "@/features/admin"

interface UsageChartProps {
  data: DailyUsage[]
}

export function UsageChart({ data }: UsageChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const max = Math.max(...data.map(d => d.count), 1)

  const total = data.reduce((s, d) => s + d.count, 0)

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Nenhum uso registrado ainda. Os dados aparecerão aqui assim que as ferramentas forem utilizadas.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2" role="img" aria-label="Gráfico de usos diários das ferramentas">
      {/* Bars */}
      <div className="flex items-end gap-px h-36">
        {data.map((d, i) => {
          const pct      = (d.count / max) * 100
          const isActive = activeIdx === i
          const date     = new Date(d.date + "T12:00:00Z")
          const label    = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })

          return (
            <div
              key={d.date}
              className="group relative flex-1 flex flex-col justify-end focus:outline-none"
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              onFocus={() => setActiveIdx(i)}
              onBlur={() => setActiveIdx(null)}
              tabIndex={0}
              aria-label={`${label}: ${d.count} uso${d.count !== 1 ? "s" : ""}`}
            >
              {/* Tooltip */}
              {isActive && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
                >
                  <span className="font-semibold text-foreground">{d.count}</span>
                  <span className="ml-1 text-muted-foreground">{label}</span>
                </div>
              )}

              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-t-[2px] transition-colors duration-100",
                  isActive ? "bg-primary" : "bg-primary/55",
                )}
                style={{ height: d.count > 0 ? `${Math.max(pct, 3)}%` : "1px" }}
              />
            </div>
          )
        })}
      </div>

      {/* X-axis labels — every 7 days + last day */}
      <div className="flex" aria-hidden>
        {data.map((d, i) => {
          const show  = i === 0 || i % 7 === 6 || i === data.length - 1
          const date  = new Date(d.date + "T12:00:00Z")
          const label = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
          return (
            <div key={d.date} className="flex-1">
              {show && (
                <span className="text-[10px] text-muted-foreground">{label}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
