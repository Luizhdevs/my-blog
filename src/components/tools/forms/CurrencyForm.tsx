"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftRight } from "lucide-react"

import {
  currencySchema,
  computeCurrency,
  CURRENCIES,
  RATES_LAST_UPDATED,
  type CurrencyInput,
} from "@/features/tools/tools/currency"
import { useToolUsageTracker } from "@/hooks/useToolUsageTracker"
import { Button }              from "@/components/ui/button"
import { Input }               from "@/components/ui/input"
import { MetricCard, ToolResult } from "@/components/tools/ToolResult"
import { cn }                  from "@/lib/utils"

interface ToolFormProps { toolSlug: string }

const selectCls = cn(
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground",
  "outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "dark:bg-input/30",
)

export function CurrencyForm({ toolSlug }: ToolFormProps) {
  const { register, watch, getValues, setValue } = useForm<CurrencyInput>({
    resolver:      zodResolver(currencySchema),
    defaultValues: { amount: 100, from: "USD", to: "BRL" },
    mode:          "onChange",
  })

  const values = watch()
  const parsed = currencySchema.safeParse(values)
  const result = parsed.success ? computeCurrency(parsed.data) : null

  useToolUsageTracker(toolSlug, result !== null && values.amount > 0)

  const handleSwap = () => {
    const { from, to } = getValues()
    setValue("from", to)
    setValue("to",   from)
  }

  const fromCurrency = CURRENCIES.find(c => c.code === values.from)
  const toCurrency   = CURRENCIES.find(c => c.code === values.to)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Inputs ─────────────────────────────────────────────── */}
      <div
        aria-label="Conversor de moedas"
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Converter
        </h2>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-foreground">
            Valor
          </label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="100"
            {...register("amount", { valueAsNumber: true })}
          />
        </div>

        {/* From / Swap / To */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="from" className="mb-1.5 block text-sm font-medium text-foreground">
              De
            </label>
            <select id="from" {...register("from")} className={selectCls}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSwap}
            aria-label="Trocar moedas"
            className="mb-0.5 shrink-0"
          >
            <ArrowLeftRight className="size-4" aria-hidden />
          </Button>

          <div className="flex-1">
            <label htmlFor="to" className="mb-1.5 block text-sm font-medium text-foreground">
              Para
            </label>
            <select id="to" {...register("to")} className={selectCls}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Taxas de referência — última atualização: {RATES_LAST_UPDATED}
        </p>
      </div>

      {/* ── Result ─────────────────────────────────────────────── */}
      <ToolResult title="Resultado">
        {result && values.amount > 0 ? (
          <div className="flex flex-col gap-3">
            <MetricCard
              label={`${values.amount} ${fromCurrency?.code ?? ""} equivale a`}
              value={`${toCurrency?.symbol ?? ""} ${result.result.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}`}
              highlight
            />
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label={`1 ${values.from} =`}
                value={`${result.rate.toLocaleString("pt-BR", {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })} ${values.to}`}
              />
              <MetricCard
                label={`1 ${values.to} =`}
                value={`${result.inverseRate.toLocaleString("pt-BR", {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })} ${values.from}`}
              />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              ⚠️ Taxas indicativas. Para operações financeiras, consulte o Banco
              Central.
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
