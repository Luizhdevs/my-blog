"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  PERCENTAGE_MODES,
  percentageSchema,
  computePercentage,
  type PercentageInput,
  type PercentageMode,
} from "@/features/tools/tools/percentage"
import { useToolUsageTracker } from "@/hooks/useToolUsageTracker"
import { Input }               from "@/components/ui/input"
import { MetricCard, ToolResult } from "@/components/tools/ToolResult"
import { cn }                  from "@/lib/utils"

interface ToolFormProps { toolSlug: string }

const MODE_FIELD_LABELS: Record<
  PercentageMode,
  { a: string; b: string; resultLabel: string }
> = {
  "percent-of":      { a: "Porcentagem (%)", b: "Valor total",        resultLabel: "Resultado" },
  "percent-change":  { a: "Valor inicial",   b: "Valor final",        resultLabel: "Variação (%)" },
  "what-percent":    { a: "Parte (X)",       b: "Total (Y)",          resultLabel: "Percentual (%)" },
  "add-percent":     { a: "Taxa a adicionar (%)", b: "Valor base",    resultLabel: "Resultado" },
  "subtract-percent":{ a: "Taxa a subtrair (%)",  b: "Valor base",    resultLabel: "Resultado" },
}

const labelCls = "mb-1.5 block text-sm font-medium text-foreground"

export function PercentageForm({ toolSlug }: ToolFormProps) {
  const [mode, setMode] = useState<PercentageMode>("percent-of")

  const { register, watch, setValue } = useForm<PercentageInput>({
    resolver:      zodResolver(percentageSchema),
    defaultValues: { mode: "percent-of", valueA: 15, valueB: 200 },
    mode:          "onChange",
  })

  const handleModeChange = (m: PercentageMode) => {
    setMode(m)
    setValue("mode", m)
  }

  const values = watch()
  const parsed = percentageSchema.safeParse({ ...values, mode })
  const result = parsed.success ? computePercentage(parsed.data) : null

  useToolUsageTracker(toolSlug, result !== null)

  const labels = MODE_FIELD_LABELS[mode]

  return (
    <div className="flex flex-col gap-6">
      {/* ── Mode selector ─────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Modo de cálculo"
      >
        {PERCENTAGE_MODES.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleModeChange(m.id)}
            aria-pressed={mode === m.id}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
              mode === m.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Form + Result ──────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          noValidate
          aria-label="Calculadora de porcentagem"
          className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {PERCENTAGE_MODES.find(m => m.id === mode)?.hint}
          </h2>

          <input type="hidden" {...register("mode")} />

          <div>
            <label htmlFor="valueA" className={labelCls}>
              {labels.a}
            </label>
            <Input
              id="valueA"
              type="number"
              step="any"
              placeholder="0"
              {...register("valueA", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label htmlFor="valueB" className={labelCls}>
              {labels.b}
            </label>
            <Input
              id="valueB"
              type="number"
              step="any"
              placeholder="0"
              {...register("valueB", { valueAsNumber: true })}
            />
          </div>
        </form>

        <ToolResult title="Resultado">
          {result ? (
            <div className="flex flex-col gap-4">
              <MetricCard
                label={labels.resultLabel}
                value={
                  result.isPercent
                    ? `${result.result.toFixed(4)}%`
                    : result.result.toLocaleString("pt-BR", {
                        maximumFractionDigits: 4,
                      })
                }
                highlight
              />
              <p className="border-l-2 border-primary/25 pl-3 text-sm leading-relaxed text-muted-foreground">
                {result.explanation}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Preencha os campos ao lado para ver o resultado.
            </p>
          )}
        </ToolResult>
      </div>
    </div>
  )
}
