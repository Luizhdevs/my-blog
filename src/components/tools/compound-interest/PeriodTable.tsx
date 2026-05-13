"use client"

import { useState, useCallback } from "react"
import { Download, Calendar }    from "lucide-react"

import type {
  YearSummary,
  PeriodSnapshot,
} from "@/features/tools/tools/compound-interest"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "annual" | "monthly"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

function buildAnnualCSV(data: YearSummary[]): string {
  const header = ["Ano", "Aportado no Período", "Juros do Período", "Juros Acumulados", "Patrimônio"]
  const rows   = data.map(r => [
    `${r.year}º ano`,
    r.yearContrib.toFixed(2).replace(".", ","),
    r.yearInterest.toFixed(2).replace(".", ","),
    r.interest.toFixed(2).replace(".", ","),
    r.balance.toFixed(2).replace(".", ","),
  ])
  return [header, ...rows].map(r => r.join(";")).join("\n")
}

function buildMonthlyCSV(data: PeriodSnapshot[]): string {
  const header = ["Mês", "Total Investido", "Juros do Mês", "Juros Acumulados", "Saldo"]
  const rows   = data.map(r => [
    `Mês ${r.period}`,
    r.invested.toFixed(2).replace(".", ","),
    r.earnedThis.toFixed(2).replace(".", ","),
    r.interest.toFixed(2).replace(".", ","),
    r.balance.toFixed(2).replace(".", ","),
  ])
  return [header, ...rows].map(r => r.join(";")).join("\n")
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Table styles ─────────────────────────────────────────────────────────────

const thCls = "px-3 py-2.5 sm:px-4 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
const tdCls = "px-3 py-2 sm:px-4 tabular-nums text-xs sm:text-sm"

// ─── Component ────────────────────────────────────────────────────────────────

interface PeriodTableProps {
  yearSummaries:  YearSummary[]
  monthlyPeriods: PeriodSnapshot[]
}

export function PeriodTable({ yearSummaries, monthlyPeriods }: PeriodTableProps) {
  const [view, setView] = useState<ViewMode>("annual")

  const handleExport = useCallback(() => {
    if (view === "annual") {
      downloadCSV(buildAnnualCSV(yearSummaries), "juros-compostos-anual.csv")
    } else {
      downloadCSV(buildMonthlyCSV(monthlyPeriods), "juros-compostos-mensal.csv")
    }
  }, [view, yearSummaries, monthlyPeriods])

  const rowCount = view === "annual" ? yearSummaries.length : monthlyPeriods.length

  return (
    <section
      aria-label="Tabela de evolução por período"
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:gap-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Calendar className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">
              Evolução Detalhada
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {rowCount}{" "}
              {view === "annual"
                ? rowCount === 1 ? "ano" : "anos"
                : rowCount === 1 ? "mês" : "meses"}{" "}
              de simulação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            role="group"
            aria-label="Visualização"
            className="flex rounded-lg border border-input bg-muted/50 p-0.5 gap-0.5"
          >
            {(["annual", "monthly"] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3",
                  view === v
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v === "annual" ? "Por Ano" : "Por Mês"}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50",
              "px-2.5 py-1.5 text-xs font-medium text-muted-foreground",
              "transition-colors hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
            aria-label="Exportar tabela como CSV"
          >
            <Download className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div
        className="overflow-x-auto overflow-y-auto overscroll-contain"
        style={{
          maxHeight: view === "monthly" && monthlyPeriods.length > 24 ? "480px" : undefined,
          WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        }}
      >
        {view === "annual" ? (
          <AnnualTable data={yearSummaries} />
        ) : (
          <MonthlyTable data={monthlyPeriods} />
        )}
      </div>
    </section>
  )
}

// ─── Annual table ─────────────────────────────────────────────────────────────

function AnnualTable({ data }: { data: YearSummary[] }) {
  return (
    <table className="w-full min-w-[520px] text-sm" role="table">
      <thead className="sticky top-0 z-10">
        <tr className="border-b border-border bg-muted/60 backdrop-blur-sm">
          <th scope="col" className={thCls}>Ano</th>
          <th scope="col" className={cn(thCls, "text-right")}>Aportado</th>
          <th scope="col" className={cn(thCls, "text-right")}>Juros do Ano</th>
          <th scope="col" className={cn(thCls, "text-right")}>Juros Acum.</th>
          <th scope="col" className={cn(thCls, "text-right")}>Patrimônio</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => {
          const isLast = i === data.length - 1
          return (
            <tr
              key={row.year}
              className={cn(
                "border-b border-border/40 transition-colors hover:bg-muted/30",
                i % 2 !== 0 && "bg-muted/10",
                isLast && "border-b-0",
              )}
            >
              <td className={cn(tdCls, isLast && "font-semibold")}>
                {row.year}º ano
              </td>
              <td className={cn(tdCls, "text-right text-foreground", isLast && "font-semibold")}>
                {fmtBRL(row.yearContrib)}
              </td>
              <td className={cn(tdCls, "text-right text-emerald-600 dark:text-emerald-400", isLast && "font-semibold")}>
                {fmtBRL(row.yearInterest)}
              </td>
              <td className={cn(tdCls, "text-right text-muted-foreground", isLast && "font-semibold text-foreground")}>
                {fmtBRL(row.interest)}
              </td>
              <td className={cn(tdCls, "text-right", isLast ? "font-bold text-primary" : "text-foreground")}>
                {fmtBRL(row.balance)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ─── Monthly table ────────────────────────────────────────────────────────────

function MonthlyTable({ data }: { data: PeriodSnapshot[] }) {
  return (
    <table className="w-full min-w-[520px] text-sm" role="table">
      <thead className="sticky top-0 z-10">
        <tr className="border-b border-border bg-muted/60 backdrop-blur-sm">
          <th scope="col" className={thCls}>Mês</th>
          <th scope="col" className={cn(thCls, "text-right")}>Total Invest.</th>
          <th scope="col" className={cn(thCls, "text-right")}>Juros do Mês</th>
          <th scope="col" className={cn(thCls, "text-right")}>Juros Acum.</th>
          <th scope="col" className={cn(thCls, "text-right")}>Saldo</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => {
          const isLast = i === data.length - 1
          return (
            <tr
              key={row.period}
              className={cn(
                "border-b border-border/40 transition-colors hover:bg-muted/30",
                i % 2 !== 0 && "bg-muted/10",
                isLast && "border-b-0",
              )}
            >
              <td className={cn(tdCls, isLast && "font-semibold")}>
                {row.period}º mês
              </td>
              <td className={cn(tdCls, "text-right text-foreground", isLast && "font-semibold")}>
                {fmtBRL(row.invested)}
              </td>
              <td className={cn(tdCls, "text-right text-emerald-600 dark:text-emerald-400", isLast && "font-semibold")}>
                {fmtBRL(row.earnedThis)}
              </td>
              <td className={cn(tdCls, "text-right text-muted-foreground", isLast && "font-semibold text-foreground")}>
                {fmtBRL(row.interest)}
              </td>
              <td className={cn(tdCls, "text-right", isLast ? "font-bold text-primary" : "text-foreground")}>
                {fmtBRL(row.balance)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
