import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { ToolMeta } from "@/types/tools"
import { getCategoryBySlug } from "@/features/tools/config/categories"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  tool: ToolMeta
}

export function ToolCard({ tool }: ToolCardProps) {
  const category = getCategoryBySlug(tool.category)

  return (
    <Link
      href={`/ferramentas/${tool.slug}`}
      className={cn(
        "group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-soft",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-elevated",
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl text-xl",
          category?.color ?? "bg-muted text-foreground",
        )}
        aria-hidden
      >
        {tool.icon}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold leading-snug text-foreground">
            {tool.name}
          </h3>
          {tool.tier !== "FREE" && (
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary">
              {tool.tier}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center">
        {category && (
          <span className="text-xs font-medium text-muted-foreground">
            {category.name}
          </span>
        )}
        <span
          className={cn(
            "ml-auto flex items-center gap-1 text-xs font-medium text-primary",
            "transition-transform duration-150 group-hover:translate-x-0.5",
          )}
        >
          Usar <ArrowRight className="size-3" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
