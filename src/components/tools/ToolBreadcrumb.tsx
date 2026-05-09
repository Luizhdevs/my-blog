import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface ToolBreadcrumbProps {
  items:      BreadcrumbItem[]
  className?: string
}

export function ToolBreadcrumb({ items, className }: ToolBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex flex-wrap items-center gap-1 text-sm text-muted-foreground", className)}
    >
      <Link
        href="/"
        className="flex items-center transition-colors hover:text-foreground"
      >
        <Home className="size-3.5" aria-hidden />
        <span className="sr-only">Início</span>
      </Link>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="size-3 text-border" aria-hidden />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
