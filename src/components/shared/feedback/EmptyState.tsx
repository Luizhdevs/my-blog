import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?:        ReactNode
  title:        string
  description?: string
  action?:      ReactNode
  className?:   string
  size?:        "sm" | "default" | "lg"
}

const sizes = {
  sm:      { wrapper: "py-10", icon: "size-12", title: "text-base", desc: "text-xs" },
  default: { wrapper: "py-16", icon: "size-16", title: "text-lg",   desc: "text-sm" },
  lg:      { wrapper: "py-24", icon: "size-20", title: "text-xl",   desc: "text-sm" },
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = "default",
}: EmptyStateProps) {
  const s = sizes[size]

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        s.wrapper,
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "mb-5 flex items-center justify-center rounded-2xl bg-muted text-muted-foreground",
            s.icon,
          )}
          aria-hidden
        >
          {icon}
        </div>
      )}

      <h3 className={cn("font-semibold text-foreground", s.title)}>{title}</h3>

      {description && (
        <p className={cn("mt-2 max-w-sm leading-relaxed text-muted-foreground", s.desc)}>
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
