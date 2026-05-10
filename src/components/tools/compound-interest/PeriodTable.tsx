"use client"

import { useCallback } from "react"
import { Download }    from "lucide-react"

import type { YearSummary } from "@/features/tools/tools/compound-interest"
import { cn }               from "@/lib/utils"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

function buildCSV(data: YearSummary[]): string {
  const header = ["Ano", "Aportado no Período", "Juros do Período", "Juros Acumulados", "Patrimônio"]
  const rows   = data.map(y => [
    y.year,
    y.yearContrib.toFixed(2).replace(".", ","),
    y.yearInterest.toFixed(2).replace(".", ","),
    y.interest.toFixed(2).replace(".", ","),
    y.balance.toFixed(2).replace(".", ","),
  ])
  return [header, ...rows].map(r => r.join(";")).join("\n")
}

function downloadCSV(data: YearSummary[]) {
  const csv  = buildCSV(data)
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = "juros-compostos.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Table ────────────────────────────────────────────────────────────────────

interface PeriodTableProps {
  data: YearSummary[]
}

export function PeriodTable({ data }: PeriodTableProps) {
  const handleExport = useCallback(() => downloadCSV(data), [data])

  return (
    <section
      aria-label="Tabela de evolução por período"
      className="rounded-2xl border border-border bg-card shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">
            Evolução por Período
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {data.length} {data.length === 1 ? "ano" : "anos"} de simulação
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50",
            "px-3 py-1.5 text-xs font-medium text-muted-foreground",
            "transition-colors hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label="Exportar tabela como CSV"
        >
          <Download className="size-3.5" aria-hidden="true" />
          Exportar CSV
        </button>
      </div>

      {/* Scroll wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm" role="table">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ano
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Aportado
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Juros do Período
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Juros Acumulados
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Patrimônio
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const isLast = i === data.length - 1
              return (
                <tr
                  key={row.year}
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-muted/30",
                    i % 2 === 0 ? "bg-transparent" : "bg-muted/10",
                    isLast && "border-b-0 font-semibold",
                  )}
                >
                  <td className="px-4 py-2.5 tabular-nums text-foreground">
                    {row.year}º ano
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-foreground">
                    {fmtBRL(row.yearContrib)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                    {fmtBRL(row.yearInterest)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                    {fmtBRL(row.interest)}
                  </td>
                  <td className={cn(
                    "px-4 py-2.5 text-right tabular-nums",
                    isLast ? "text-primary" : "text-foreground",
                  )}>
                    {fmtBRL(row.balance)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
