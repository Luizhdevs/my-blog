"use client"

import { useState } from "react"
import { cn }       from "@/lib/utils"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDisplay(v: number): string {
  if (v === 0) return ""
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v)
}

function parseInput(s: string): number {
  // Brazilian: dot = thousand separator, comma = decimal
  // Remove everything except digits and comma, treat comma as decimal
  const clean = s.replace(/[^\d,]/g, "").replace(",", ".")
  const n     = parseFloat(clean)
  return isNaN(n) ? 0 : n
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface CurrencyInputProps {
  id:           string
  value:        number
  onChange:     (v: number) => void
  onBlur?:      () => void
  placeholder?: string
  hasError?:    boolean
  describedBy?: string
  className?:   string
}

export function CurrencyInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "0,00",
  hasError,
  describedBy,
  className,
}: CurrencyInputProps) {
  const [focused,   setFocused]   = useState(false)
  const [rawInput,  setRawInput]  = useState("")

  function handleFocus() {
    setFocused(true)
    // Show plain number so editing is easy
    setRawInput(value === 0 ? "" : String(value))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const s = e.target.value
    setRawInput(s)
    onChange(parseInput(s))
  }

  function handleBlur() {
    setFocused(false)
    onBlur?.()
  }

  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground"
        aria-hidden="true"
      >
        R$
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={focused ? rawInput : fmtDisplay(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-invalid={hasError ?? false}
        aria-describedby={describedBy}
        className={cn(
          "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent",
          "pl-9 pr-3 py-1 text-sm text-foreground outline-none transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20",
          "dark:bg-input/30",
          className,
        )}
      />
    </div>
  )
}
