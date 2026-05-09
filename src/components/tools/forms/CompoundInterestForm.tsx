"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  compoundInterestSchema,
  computeCompoundInterest,
  type CompoundInterestInput,
} from "@/features/tools/tools/compound-interest"
import { Input } from "@/components/ui/input"
import { MetricCard, ToolResult } from "@/components/tools/ToolResult"
import { cn } from "@/lib/utils"

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style:    "currency",
    currency: "BRL",
  }).format(value)
}

const labelCls = "mb-1.5 block text-sm font-medium text-foreground"
const errorCls = "mt-1 text-xs text-destructive"

export function CompoundInterestForm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<CompoundInterestInput>({
    resolver:      zodResolver(compoundInterestSchema),
    defaultValues: { principal: 1000, rate: 1, periods: 12, periodType: "monthly" },
    mode:          "onChange",
  })

  const values = watch()
  const parsed = compoundInterestSchema.safeParse(values)
  const result = parsed.success ? computeCompoundInterest(parsed.data) : null

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Inputs ─────────────────────────────────────────────── */}
      <form
        noValidate
        aria-label="Calculadora de juros compostos"
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Dados do cálculo
        </h2>

        {/* Principal */}
        <div>
          <label htmlFor="principal" className={labelCls}>
            Valor inicial (R$)
          </label>
          <Input
            id="principal"
            type="number"
            step="0.01"
            min="0"
            placeholder="1000"
            aria-invalid={!!errors.principal}
            aria-describedby={errors.principal ? "principal-err" : undefined}
            {...register("principal", { valueAsNumber: true })}
          />
          {errors.principal && (
            <p id="principal-err" role="alert" className={errorCls}>
              {errors.principal.message}
            </p>
          )}
        </div>

        {/* Rate */}
        <div>
          <label htmlFor="rate" className={labelCls}>
            Taxa de juros (% por período)
          </label>
          <Input
            id="rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="1"
            aria-invalid={!!errors.rate}
            aria-describedby={errors.rate ? "rate-err" : undefined}
            {...register("rate", { valueAsNumber: true })}
          />
          {errors.rate && (
            <p id="rate-err" role="alert" className={errorCls}>
              {errors.rate.message}
            </p>
          )}
        </div>

        {/* Periods + Period type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="periods" className={labelCls}>
              Nº de períodos
            </label>
            <Input
              id="periods"
              type="number"
              step="1"
              min="1"
              placeholder="12"
              aria-invalid={!!errors.periods}
              {...register("periods", { valueAsNumber: true })}
            />
            {errors.periods && (
              <p role="alert" className={errorCls}>
                {errors.periods.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="periodType" className={labelCls}>
              Capitalização
            </label>
            <select
              id="periodType"
              {...register("periodType")}
              className={cn(
                "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground",
                "outline-none transition-colors",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "dark:bg-input/30",
              )}
            >
              <option value="monthly">Mensal</option>
              <option value="annual">Anual</option>
            </select>
          </div>
        </div>
      </form>

      {/* ── Result ─────────────────────────────────────────────── */}
      <ToolResult title="Resultado">
        {result ? (
          <div className="flex flex-col gap-3">
            <MetricCard
              label="Montante final"
              value={formatBRL(result.finalAmount)}
              highlight
            />
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Juros acumulados"
                value={formatBRL(result.totalInterest)}
              />
              <MetricCard
                label="Rentabilidade"
                value={`${result.totalReturn.toFixed(2)}%`}
              />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Taxa efetiva mensal:{" "}
              <strong className="text-foreground">
                {result.monthlyRate.toFixed(4)}%
              </strong>
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Preencha os campos ao lado para ver o resultado.
          </p>
        )}
      </ToolResult>
    </div>
  )
}
