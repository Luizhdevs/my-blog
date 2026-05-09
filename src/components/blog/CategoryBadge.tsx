import { cn } from "@/lib/utils"
import { getCategoryBySlug } from "@/features/blog/config/categories"

const COLOR_MAP: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  blue:    "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  violet:  "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  amber:   "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  default: "bg-primary/10 text-primary",
}

interface CategoryBadgeProps {
  slug:       string
  className?: string
}

export function CategoryBadge({ slug, className }: CategoryBadgeProps) {
  const category = getCategoryBySlug(slug)
  const color    = COLOR_MAP[category?.color ?? "default"] ?? COLOR_MAP.default

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        color,
        className,
      )}
    >
      {category?.name ?? slug}
    </span>
  )
}
