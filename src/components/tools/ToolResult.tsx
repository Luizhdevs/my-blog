import { cn } from "@/lib/utils"

// ─── Metric card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  label:      string
  value:      string
  highlight?: boolean
  className?: string
}

export function MetricCard({ label, value, highlight, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border p-4",
        highlight
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-muted/30",
        className,
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-heading text-2xl font-bold tabular-nums leading-tight",
          highlight ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Result wrapper ───────────────────────────────────────────────────────────

interface ToolResultProps {
  title?:     string
  children:   React.ReactNode
  className?: string
}

export function ToolResult({ title, children, className }: ToolResultProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-soft",
        className,
      )}
    >
      {title && (
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
