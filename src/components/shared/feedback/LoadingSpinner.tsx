import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?:      "xs" | "sm" | "md" | "lg"
  className?: string
  label?:     string
}

const sizes = {
  xs: "size-3 border",
  sm: "size-4 border-2",
  md: "size-7 border-2",
  lg: "size-11 border-[3px]",
}

export function LoadingSpinner({
  size = "md",
  className,
  label = "Carregando...",
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-border border-t-primary",
        sizes[size],
        className,
      )}
    />
  )
}

export function PageLoading({ label }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label ?? "Carregando página..."}
      className="flex min-h-[400px] items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {label && (
          <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
        )}
      </div>
    </div>
  )
}
