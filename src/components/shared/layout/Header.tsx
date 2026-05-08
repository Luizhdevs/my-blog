"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/shared/Container"
import { Logo } from "@/components/shared/Logo"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { NavLink } from "@/components/shared/layout/NavLink"
import { MobileNav } from "@/components/shared/layout/MobileNav"
import { mainNav } from "@/config/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled,    setIsScrolled]    = useState(false)
  const [isMobileOpen,  setIsMobileOpen]  = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* Bloqueia scroll do body enquanto menu mobile está aberto */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMobileOpen])

  return (
    <>
      {/* Skip to content — acessibilidade */}
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]",
          "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        )}
      >
        Ir para o conteúdo
      </a>

      <header
        role="banner"
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "border-b border-border bg-background/95 backdrop-blur-xl shadow-soft"
            : "bg-background/80 backdrop-blur-sm",
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ──────────────────────────────────────────── */}
            <Logo />

            {/* ── Desktop navigation ────────────────────────────── */}
            <nav
              aria-label="Navegação principal"
              className="hidden md:flex items-center gap-7"
            >
              {mainNav.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  exact={item.href === "/"}
                  className="relative py-1 text-sm after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:rounded-full after:bg-primary after:scale-x-0 data-[active]:after:scale-x-100 after:transition-transform after:duration-200"
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-px text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* ── Right actions ─────────────────────────────────── */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Button
                asChild
                size="sm"
                className="hidden md:inline-flex rounded-full px-5 font-semibold"
              >
                <Link href="/ferramentas">Ferramentas →</Link>
              </Button>

              {/* Hamburger — mobile only */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Abrir menu de navegação"
                aria-expanded={isMobileOpen}
                aria-controls="mobile-nav"
              >
                <Menu className="size-5" />
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* ── Mobile navigation drawer ────────────────────────────── */}
      <MobileNav
        id="mobile-nav"
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
    </>
  )
}
