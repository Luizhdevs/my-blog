import { cn } from "@/lib/utils"

interface StatsCardProps {
  title:      string
  value:      number | string
  subtitle?:  string
  icon?:      React.ReactNode
  trend?:     { label: string; positive?: boolean }
  className?: string
}

export function StatsCard({ title, value, subtitle, icon, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold font-heading tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {trend && (
        <p className={cn("text-xs font-medium", trend.positive ? "text-emerald-600" : "text-muted-foreground")}>
          {trend.label}
        </p>
      )}
    </div>
  )
}
