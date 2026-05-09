import type { PostStatus } from "@prisma/client"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<PostStatus, { label: string; className: string }> = {
  DRAFT:     { label: "Rascunho",  className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  PUBLISHED: { label: "Publicado", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  SCHEDULED: { label: "Agendado",  className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
}

interface PostStatusBadgeProps {
  status:     PostStatus
  className?: string
}

export function PostStatusBadge({ status, className }: PostStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
