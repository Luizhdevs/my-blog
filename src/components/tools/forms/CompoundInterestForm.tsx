"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useForm, Controller }                       from "react-hook-form"
import { zodResolver }                               from "@hookform/resolvers/zod"
import dynamic                                       from "next/dynamic"
import { RotateCcw, Loader2, TrendingUp }            from "lucide-react"

import {
  compoundInterestSchema,
  computeCompoundInterest,
  type CompoundInterestInput,
  type CompoundInterestResult,
} from "@/features/tools/tools/compound-interest"
import { useToolUsageTracker } from "@/hooks/useToolUsageTracker"
import { CurrencyInput }       from "@/components/tools/compound-interest/CurrencyInput"
import { HeroResult }          from "@/components/tools/compound-interest/HeroResult"
import { PeriodTable }         from "@/components/tools/compound-interest/PeriodTable"
import { cn }                  from "@/lib/utils"

// ─── Lazy charts ──────────────────────────────────────────────────────────────

const EvolutionChart = dynamic(
  () => import("@/components/tools/compound-interest/EvolutionChart").then(m => m.EvolutionChart),
  {
    ssr:     false,
    loading: () => (
      <div
        className="animate-pulse rounded-2xl border border-border bg-muted/30 h-[220px] sm:h-[280px] lg:h-[340px]"
        aria-hidden="true"
      />
    ),
  },
)

const AllocationChart = dynamic(
  () => import("@/components/tools/compound-interest/AllocationChart").then(m => m.AllocationChart),
  {
    ssr:     false,
    loading: () => (
      <div
        className="animate-pulse rounded-2xl border border-border bg-muted/30 h-[180px] sm:h-[220px] lg:h-[260px]"
        aria-hidden="true"
      />
    ),
  },
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

// ─── Session helpers ──────────────────────────────────────────────────────────

function sessionLoad(): { values: CompoundInterestInput; result: CompoundInterestResult | null } {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return { values: DEFAULT_VALUES, result: null }
    const parsed = compoundInterestSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return { values: DEFAULT_VALUES, result: null }
    return { values: parsed.data, result: computeCompoundInterest(parsed.data) }
  } catch {
    return { values: DEFAULT_VALUES, result: null }
  }
}

function sessionSave(data: CompoundInterestInput) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)) } catch {}
}

function sessionClear() {
  try { sessionStorage.removeItem(SESSION_KEY) } catch {}
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelCls = "mb-1.5 block text-sm font-medium text-foreground"
const errorCls = "mt-1 text-xs text-destructive"

const addonInputCls = cn(
  "h-11 w-full min-w-0 rounded-lg border border-input bg-transparent",
  "px-3 py-1 text-sm text-foreground outline-none transition-colors",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20",
  "dark:bg-input/30",
)

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border px-6 py-10 text-center sm:min-h-[320px]">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
        <TrendingUp className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="max-w-[240px]">
        <p className="text-sm font-semibold text-foreground">Pronto para simular?</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Preencha os parâmetros e clique em{" "}
          <strong className="text-foreground">Calcular</strong> para ver a projeção completa.
        </p>
      </div>
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface ToolFormProps { toolSlug: string }

export function CompoundInterestForm({ toolSlug }: ToolFormProps) {
  const hydrated                              = useRef(false)
  const resultsRef                            = useRef<HTMLDivElement>(null)
  const [submittedResult, setSubmittedResult] = useState<CompoundInterestResult | null>(null)
  const [isCalculating,   setIsCalculating]   = useState(false)

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CompoundInterestInput>({
    resolver:      zodResolver(compoundInterestSchema),
    defaultValues: DEFAULT_VALUES,
    mode:          "onBlur",
  })

  // Hydrate from sessionStorage once — also restores the last confirmed result
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const { values, result } = sessionLoad()
    reset(values)
    setSubmittedResult(result)
  }, [reset])

  const periodType = watch("periodType")
  const isMonthly  = periodType === "monthly"

  useToolUsageTracker(toolSlug, submittedResult !== null)

  const onSubmit = useCallback((data: CompoundInterestInput) => {
    setIsCalculating(true)
    // Defer by one frame so the loading state paints before synchronous computation
    setTimeout(() => {
      const result = computeCompoundInterest(data)
      setSubmittedResult(result)
      sessionSave(data)
      setIsCalculating(false)
      // On mobile (below lg), scroll results into view after React flushes the DOM
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 60)
      }
    }, 0)
  }, [])

  const handleReset = useCallback(() => {
    sessionClear()
    reset(DEFAULT_VALUES)
    setSubmittedResult(null)
  }, [reset])

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[300px_1fr]">

      {/* ══ Form panel (sticky on lg) ═════════════════════════════ */}
      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <form
          noValidate
          aria-label="Calculadora de juros compostos"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:gap-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Parâmetros
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs",
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
                  onClick={() => setValue("periodType", type, { shouldValidate: false })}
                  aria-pressed={periodType === type}
                  className={cn(
                    "flex-1 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150",
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
                inputMode="decimal"
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
              Período ({isMonthly ? "meses" : "anos"})
            </label>
            <div className="relative">
              <input
                id="ci-periods"
                type="number"
                inputMode="numeric"
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

          {/* ── CTA Calcular ─────────────────────────────────────── */}
          <button
            type="submit"
            disabled={isCalculating}
            className={cn(
              "mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl",
              "bg-primary px-4 text-sm font-semibold text-primary-foreground",
              "transition-all hover:bg-primary/90 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-70",
            )}
          >
            {isCalculating ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Calculando…
              </>
            ) : (
              "Calcular"
            )}
          </button>

          {/* ── Taxa efetiva (pós-cálculo) ───────────────────────── */}
          {submittedResult && (
            <div className="rounded-lg bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              Último cálculo — taxa mensal efetiva:{" "}
              <strong className="text-foreground">
                {submittedResult.effectiveMonthlyRate.toFixed(4)}% a.m.
              </strong>
            </div>
          )}
        </form>
      </aside>

      {/* ══ Results panel ═════════════════════════════════════════ */}
      <div
        ref={resultsRef}
        role="region"
        aria-label="Resultados da simulação"
        aria-live="polite"
        className="min-w-0 flex flex-col gap-4 sm:gap-6"
      >
        {submittedResult ? (
          <>
            <HeroResult result={submittedResult} />
            <EvolutionChart
              data={submittedResult.monthlyPeriods}
              totalMonths={submittedResult.monthlyPeriods.length}
            />
            <AllocationChart data={submittedResult.yearSummaries} />
            <PeriodTable
              yearSummaries={submittedResult.yearSummaries}
              monthlyPeriods={submittedResult.monthlyPeriods}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
