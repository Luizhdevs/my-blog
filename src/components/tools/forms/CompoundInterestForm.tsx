"use client"

import { lazy, Suspense, useEffect, useRef } from "react"
import { useForm }                            from "react-hook-form"
import { zodResolver }                    from "@hookform/resolvers/zod"
import { TrendingUp, Wallet, RefreshCw } from "lucide-react"

import {
  compoundInterestSchema,
  computeCompoundInterest,
  type CompoundInterestInput,
} from "@/features/tools/tools/compound-interest"
import { useToolUsageTracker } from "@/hooks/useToolUsageTracker"
import { Input }               from "@/components/ui/input"
import { cn }                  from "@/lib/utils"
import { SummaryCards }        from "@/components/tools/compound-interest/SummaryCards"
import { PeriodTable }         from "@/components/tools/compound-interest/PeriodTable"

// Charts are lazy-loaded to defer Recharts bundle from initial paint
const EvolutionChart = lazy(() =>
  import("@/components/tools/compound-interest/EvolutionChart").then(m => ({ default: m.EvolutionChart }))
)
const AllocationChart = lazy(() =>
  import("@/components/tools/compound-interest/AllocationChart").then(m => ({ default: m.AllocationChart }))
)

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "ci-calculator-v1"

const DEFAULT_VALUES: CompoundInterestInput = {
  principal:           10000,
  monthlyContribution: 500,
  rate:                1,
  periods:             24,
  periodType:          "monthly",
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelCls = "mb-1.5 block text-sm font-medium text-foreground"
const errorCls = "mt-1 text-xs text-destructive"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadFromStorage(): CompoundInterestInput {
  if (typeof window === "undefined") return DEFAULT_VALUES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_VALUES
    const parsed = compoundInterestSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : DEFAULT_VALUES
  } catch {
    return DEFAULT_VALUES
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div
      className="h-[280px] animate-pulse rounded-2xl border border-border bg-muted/30"
      aria-hidden="true"
    />
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface ToolFormProps { toolSlug: string }

export function CompoundInterestForm({ toolSlug }: ToolFormProps) {
  const hydrated = useRef(false)

  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CompoundInterestInput>({
    resolver:      zodResolver(compoundInterestSchema),
    defaultValues: DEFAULT_VALUES,
    mode:          "onTouched",
  })

  // Load persisted values after hydration (avoids SSR mismatch)
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const saved = loadFromStorage()
    reset(saved)
  }, [reset])

  const values     = watch()
  const periodType = values.periodType
  const parsed     = compoundInterestSchema.safeParse(values)
  const result     = parsed.success ? computeCompoundInterest(parsed.data) : null

  useToolUsageTracker(toolSlug, result !== null)

  // Persist to localStorage on every valid change
  useEffect(() => {
    if (!hydrated.current) return
    if (parsed.success) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data)) } catch {}
    }
  }, [parsed.success, parsed.data])

  const isMonthly = periodType === "monthly"

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* ── Form panel (sticky on desktop) ───────────────────── */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <form
          noValidate
          aria-label="Calculadora de juros compostos"
          className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          {/* Heading */}
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" aria-hidden="true" />
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Parâmetros
            </h2>
          </div>

          {/* Periodicidade toggle */}
          <fieldset>
            <legend className={labelCls}>Periodicidade</legend>
            <div
              role="group"
              className="flex rounded-lg border border-input bg-muted/50 p-0.5 gap-0.5"
            >
              {(["monthly", "annual"] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue("periodType", type, { shouldValidate: true })}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                    periodType === type
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={periodType === type}
                >
                  {type === "monthly" ? "Mensal" : "Anual"}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Aporte inicial */}
          <div>
            <label htmlFor="ci-principal" className={labelCls}>
              <span className="flex items-center gap-1.5">
                <Wallet className="size-3.5 text-muted-foreground" aria-hidden="true" />
                Aporte inicial (R$)
              </span>
            </label>
            <Input
              id="ci-principal"
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
              aria-invalid={!!errors.principal}
              aria-describedby={errors.principal ? "ci-principal-err" : undefined}
              {...register("principal", { valueAsNumber: true })}
            />
            {errors.principal && (
              <p id="ci-principal-err" role="alert" className={errorCls}>
                {errors.principal.message}
              </p>
            )}
          </div>

          {/* Aporte mensal */}
          <div>
            <label htmlFor="ci-contribution" className={labelCls}>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="size-3.5 text-muted-foreground" aria-hidden="true" />
                Aporte mensal (R$)
              </span>
            </label>
            <Input
              id="ci-contribution"
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
              aria-invalid={!!errors.monthlyContribution}
              aria-describedby={errors.monthlyContribution ? "ci-contribution-err" : undefined}
              {...register("monthlyContribution", { valueAsNumber: true })}
            />
            {errors.monthlyContribution && (
              <p id="ci-contribution-err" role="alert" className={errorCls}>
                {errors.monthlyContribution.message}
              </p>
            )}
          </div>

          {/* Taxa de juros */}
          <div>
            <label htmlFor="ci-rate" className={labelCls}>
              Taxa de juros (% {isMonthly ? "a.m." : "a.a."})
            </label>
            <Input
              id="ci-rate"
              type="number"
              step="0.001"
              min="0.001"
              placeholder={isMonthly ? "1" : "12"}
              aria-invalid={!!errors.rate}
              aria-describedby={errors.rate ? "ci-rate-err" : undefined}
              {...register("rate", { valueAsNumber: true })}
            />
            {errors.rate && (
              <p id="ci-rate-err" role="alert" className={errorCls}>
                {errors.rate.message}
              </p>
            )}
          </div>

          {/* Períodos */}
          <div>
            <label htmlFor="ci-periods" className={labelCls}>
              Período ({isMonthly ? "meses" : "anos"})
            </label>
            <Input
              id="ci-periods"
              type="number"
              step="1"
              min="1"
              max={isMonthly ? 600 : 50}
              placeholder={isMonthly ? "24" : "10"}
              aria-invalid={!!errors.periods}
              aria-describedby={errors.periods ? "ci-periods-err" : "ci-periods-hint"}
              {...register("periods", { valueAsNumber: true })}
            />
            <p id="ci-periods-hint" className="mt-1 text-xs text-muted-foreground">
              Máx. {isMonthly ? "600 meses (50 anos)" : "50 anos"}
            </p>
            {errors.periods && (
              <p id="ci-periods-err" role="alert" className={errorCls}>
                {errors.periods.message}
              </p>
            )}
          </div>
        </form>
      </aside>

      {/* ── Results panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {result ? (
          <>
            <SummaryCards result={result} />

            <Suspense fallback={<ChartSkeleton />}>
              <EvolutionChart
                data={result.monthlyPeriods}
                totalMonths={result.monthlyPeriods.length}
              />
            </Suspense>

            <Suspense fallback={<ChartSkeleton />}>
              <AllocationChart data={result.yearSummaries} />
            </Suspense>

            <PeriodTable data={result.yearSummaries} />
          </>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border"
          >
            <p className="text-sm text-muted-foreground">
              Preencha os campos ao lado para ver o resultado.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
