"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/shared/Logo"
import { mainNav, toolCategories } from "@/config/navigation"
import { cn, isActiveLink } from "@/lib/utils"

interface MobileNavProps {
  open:    boolean
  onClose: () => void
  id?:     string
}

const ease = [0.25, 0.1, 0.25, 1] as const

const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease } },
  exit:    { opacity: 0, transition: { duration: 0.18, ease } },
}

const panelVariants: Variants = {
  hidden:  { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 28, stiffness: 280 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.2, ease },
  },
}

export function MobileNav({ open, onClose, id }: MobileNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) => isActiveLink(pathname, href)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ───────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* ── Panel ──────────────────────────────────────────── */}
          <motion.div
            key="panel"
            id={id}
            role="dialog"
            aria-modal
            aria-label="Menu de navegação"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 flex h-full w-[300px] max-w-[90vw] flex-col bg-background shadow-overlay"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Logo onClick={onClose} />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Fechar menu"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">

              {/* Main nav */}
              <nav aria-label="Menu principal" className="p-4">
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Navegação
                </p>
                {mainNav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045 + 0.12, duration: 0.22, ease }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium",
                        "transition-colors duration-150",
                        isActive(item.href)
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                      {item.badge && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-px text-[10px] font-semibold text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <Separator />

              {/* Tool categories */}
              <nav aria-label="Categorias de ferramentas" className="p-4">
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Ferramentas
                </p>
                {toolCategories.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: (mainNav.length + i) * 0.045 + 0.12,
                      duration: 0.22,
                      ease,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                        "transition-colors duration-150",
                        isActive(item.href)
                          ? "bg-accent text-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                      {item.badge && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-px text-[10px] font-semibold text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-border p-4">
              <Button asChild className="w-full rounded-full font-semibold" size="lg">
                <Link href="/ferramentas" onClick={onClose}>
                  Ver todas as ferramentas →
                </Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
