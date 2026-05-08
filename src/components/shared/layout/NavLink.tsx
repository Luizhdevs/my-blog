"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface NavLinkProps {
  href:            string
  children:        React.ReactNode
  className?:      string
  activeClassName?: string
  exact?:          boolean
  onClick?:        () => void
}

export function NavLink({
  href,
  children,
  className,
  activeClassName,
  exact = false,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = exact
    ? pathname === href
    : pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      onClick={onClick}
      data-active={isActive || undefined}
      className={cn(
        "text-sm font-medium transition-colors duration-150",
        "hover:text-foreground focus-visible:text-foreground",
        isActive
          ? cn("text-foreground", activeClassName)
          : "text-muted-foreground",
        className,
      )}
    >
      {children}
    </Link>
  )
}
