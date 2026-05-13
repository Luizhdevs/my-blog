"use client"

import { useMemo, useEffect, useRef, useCallback } from "react"
import { useForm, Controller }                      from "react-hook-form"
import { zodResolver }                              from "@hookform/resolvers/zod"
import dynamic                                      from "next/dynamic"
import { RotateCcw }                                from "lucide-react"

import {
  compoundInterestSchema,
  computeCompoundInterest,
  type CompoundInterestInput,
} from "@/features/tools/tools/compound-interest"
import { useToolUsageTracker }  from "@/hooks/useToolUsageTracker"
import { CurrencyInput }        from "@/components/tools/compound-interest/CurrencyInput"
import { HeroResult }           from "@/components/tools/compound-interest/HeroResult"
import { PeriodTable }          from "@/components/tools/compound-interest/PeriodTable"
import { cn }                   from "@/lib/utils"

// ─── Lazy charts (next/dynamic, ssr:false — no hydration mismatch) ────────────

const ChartSkeleton = () => (
  <div
    className="animate-pulse rounded-2xl border border-border bg-muted/30"
    style={{ height: "340px" }}
    aria-hidden="true"
  />
)

const EvolutionChart = dynamic(
  () => import("@/components/tools/compound-interest/EvolutionChart").then(m => m.EvolutionChart),
  { ssr: false, loading: ChartSkeleton },
)

const AllocationChart = dynamic(
  () => import("@/components/tools/compound-interest/AllocationChart").then(m => m.AllocationChart),
  { ssr: false, loading: () => <div className="animate-pulse rounded-2xl border border-border bg-muted/30 h-[260px]" aria-hidden="true" /> },
)

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_KEY = "ci-calculator-session"

const DEFAULT_VALUES: CompoundInterestInput = {
  principal:           10000,
  monthlyContribution: 500,
  rate:                1,
  periods:             24,
  periodType:          "monthly",
}

// ─── Session storage helpers (no SSR touch) ───────────────────────────────────

function sessionLoad(): CompoundInterestInput {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return DEFAULT_VALUES
    const parsed = compoundInterestSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : DEFAULT_VALUES
  } catch {
    return DEFAULT_VALUES
  }
}

function sessionSave(data: CompoundInterestInput) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)) } catch {}
}

function sessionClear() {
  try { sessionStorage.removeItem(SESSION_KEY) } catch {}
}

// ─── Shared field styles ──────────────────────────────────────────────────────

const labelCls = "mb-1.5 block text-sm font-medium text-foreground"
const errorCls = "mt-1 text-xs text-destructive"

const addonInputCls = cn(
  "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent",
  "px-3 py-1 text-sm text-foreground outline-none transition-colors",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20",
  "dark:bg-input/30",
)

// ─── Form ─────────────────────────────────────────────────────────────────────

interface ToolFormProps { toolSlug: string }

export function CompoundInterestForm({ toolSlug }: ToolFormProps) {
  const hydrated = useRef(false)

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CompoundInterestInput>({
    resolver:      zodResolver(compoundInterestSchema),
    defaultValues: DEFAULT_VALUES,
    mode:          "onChange",
  })

  // Hydrate from sessionStorage once (avoids SSR/client mismatch)
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    reset(sessionLoad())
  }, [reset])

  const values     = watch()
  const periodType = values.periodType
  const isMonthly  = periodType === "monthly"

  // Memoised calculation — recomputes only when values change
  const result = useMemo(() => {
    const parsed = compoundInterestSchema.safeParse(values)
    return parsed.success ? computeCompoundInterest(parsed.data) : null
  }, [values])

  // Keep last valid result visible while user edits an invalid interim state
  const lastResult = useRef(result)
  if (result !== null) lastResult.current = result
  const displayed = result ?? lastResult.current

  useToolUsageTracker(toolSlug, result !== null)

  // Persist to sessionStorage on every valid change (session-scoped only)
  useEffect(() => {
    if (!hydrated.current) return
    const parsed = compoundInterestSchema.safeParse(values)
    if (parsed.success) sessionSave(parsed.data)
  }, [values])

  const handleReset = useCallback(() => {
    sessionClear()
    reset(DEFAULT_VALUES)
  }, [reset])

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

      {/* ══ Form panel (sticky) ════════════════════════════════════ */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <form
          noValidate
          aria-label="Calculadora de juros compostos"
          className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Parâmetros
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs",
                "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Limpar cálculo e restaurar valores padrão"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Limpar
            </button>
          </div>

          {/* ── Periodicidade ───────────────────────────────────── */}
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
                  aria-pressed={periodType === type}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
                    periodType === type
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {type === "monthly" ? "Mensal" : "Anual"}
                </button>
              ))}
            </div>
          </fieldset>

          {/* ── Aporte inicial ──────────────────────────────────── */}
          <div>
            <label htmlFor="ci-principal" className={labelCls}>
              Aporte inicial (R$)
            </label>
            <Controller
              name="principal"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="ci-principal"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="0,00"
                  hasError={!!errors.principal}
                  describedBy={errors.principal ? "ci-principal-err" : undefined}
                />
              )}
            />
            {errors.principal && (
              <p id="ci-principal-err" role="alert" className={errorCls}>
                {errors.principal.message}
              </p>
            )}
          </div>

          {/* ── Aporte mensal ───────────────────────────────────── */}
          <div>
            <label htmlFor="ci-contribution" className={labelCls}>
              Aporte mensal (R$)
            </label>
            <Controller
              name="monthlyContribution"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="ci-contribution"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="0,00"
                  hasError={!!errors.monthlyContribution}
                  describedBy={errors.monthlyContribution ? "ci-contribution-err" : undefined}
                />
              )}
            />
            {errors.monthlyContribution && (
              <p id="ci-contribution-err" role="alert" className={errorCls}>
                {errors.monthlyContribution.message}
              </p>
            )}
          </div>

          {/* ── Taxa de juros ───────────────────────────────────── */}
          <div>
            <label htmlFor="ci-rate" className={labelCls}>
              Taxa de juros (% {isMonthly ? "a.m." : "a.a."})
            </label>
            <div className="relative">
              <input
                id="ci-rate"
                type="number"
                step="0.001"
                min="0.001"
                placeholder={isMonthly ? "1" : "12"}
                aria-invalid={!!errors.rate}
                aria-describedby={errors.rate ? "ci-rate-err" : undefined}
                {...register("rate", { valueAsNumber: true })}
                className={addonInputCls}
              />
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </div>
            {errors.rate && (
              <p id="ci-rate-err" role="alert" className={errorCls}>
                {errors.rate.message}
              </p>
            )}
          </div>

          {/* ── Período ─────────────────────────────────────────── */}
          <div>
            <label htmlFor="ci-periods" className={labelCls}>
              Período
            </label>
            <div className="relative">
              <input
                id="ci-periods"
                type="number"
                step="1"
                min="1"
                max={isMonthly ? 600 : 50}
                placeholder={isMonthly ? "24" : "10"}
                aria-invalid={!!errors.periods}
                aria-describedby={errors.periods ? "ci-periods-hint ci-periods-err" : "ci-periods-hint"}
                {...register("periods", { valueAsNumber: true })}
                className={cn(addonInputCls, "pr-16")}
              />
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                aria-hidden="true"
              >
                {isMonthly ? "meses" : "anos"}
              </span>
            </div>
            <p id="ci-periods-hint" className="mt-1 text-xs text-muted-foreground">
              Máx. {isMonthly ? "600 meses (50 anos)" : "50 anos"}
            </p>
            {errors.periods && (
              <p id="ci-periods-err" role="alert" className={errorCls}>
                {errors.periods.message}
              </p>
            )}
          </div>

          {/* ── Taxa efetiva (informativo) ──────────────────────── */}
          {displayed && (
            <div className="rounded-lg bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              Taxa mensal efetiva:{" "}
              <strong className="text-foreground">
                {displayed.effectiveMonthlyRate.toFixed(4)}% a.m.
              </strong>
            </div>
          )}
        </form>
      </aside>

      {/* ══ Results panel ══════════════════════════════════════════ */}
      <div
        role="region"
        aria-label="Resultados da simulação"
        aria-live="polite"
        className="flex flex-col gap-6"
      >
        {displayed ? (
          <>
            <HeroResult result={displayed} />
            <EvolutionChart
              data={displayed.monthlyPeriods}
              totalMonths={displayed.monthlyPeriods.length}
            />
            <AllocationChart data={displayed.yearSummaries} />
            <PeriodTable
              yearSummaries={displayed.yearSummaries}
              monthlyPeriods={displayed.monthlyPeriods}
            />
          </>
        ) : (
          <div
            role="status"
            className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-border"
          >
            <p className="text-sm text-muted-foreground">
              Preencha ao menos um dos aportes para ver o resultado.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
