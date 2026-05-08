"use client"

import { motion } from "framer-motion"

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
    <motion.span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block rounded-full border-border border-t-primary",
        sizes[size],
        className,
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
    />
  )
}

/* Centered loading state — para uso em páginas inteiras */
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
