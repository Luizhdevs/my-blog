import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?:    string
  showWordmark?: boolean
  size?:         "sm" | "md" | "lg"
  href?:         string
  onClick?:      () => void
}

const sizes = {
  sm: { mark: "size-7  rounded-md text-xs",   text: "text-sm  tracking-tight" },
  md: { mark: "size-8  rounded-lg text-sm",   text: "text-base tracking-tight" },
  lg: { mark: "size-10 rounded-xl text-base", text: "text-lg  tracking-tight" },
}

export function Logo({
  className,
  showWordmark = true,
  size = "md",
  href = "/",
  onClick,
}: LogoProps) {
  const s = sizes[size]

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("group inline-flex items-center gap-2.5 outline-none", className)}
      aria-label={siteConfig.name}
    >
      {/* Icon mark */}
      <span
        className={cn(
          "flex shrink-0 items-center justify-center font-heading font-bold",
          "bg-primary text-primary-foreground",
          "ring-1 ring-primary/20 group-hover:ring-primary/40",
          "transition-all duration-200 group-hover:scale-[1.04]",
          s.mark,
        )}
        aria-hidden
      >
        {siteConfig.name.charAt(0).toUpperCase()}
      </span>

      {showWordmark && (
        <span
          className={cn(
            "font-heading font-bold text-foreground",
            "transition-colors duration-200 group-hover:text-primary",
            s.text,
          )}
        >
          {siteConfig.name}
        </span>
      )}
    </Link>
  )
}
