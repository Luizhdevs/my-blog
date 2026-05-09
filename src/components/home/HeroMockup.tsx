"use client"

import { motion } from "framer-motion"
import {
  Calculator,
  ArrowLeftRight,
  Palette,
  TrendingUp,
  Code2,
  Scale,
  Layers,
  CheckCircle2,
} from "lucide-react"

const tools = [
  { icon: Calculator,     label: "Financiamento",  color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" },
  { icon: ArrowLeftRight, label: "Conversor",       color: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400" },
  { icon: Palette,        label: "Paleta",          color: "bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400" },
  { icon: TrendingUp,     label: "Juros Compostos", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" },
  { icon: Code2,          label: "JSON",            color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" },
  { icon: Scale,          label: "Calc. IMC",       color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400" },
]

export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[460px] select-none" aria-hidden>
      {/* Browser frame */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-overlay ring-1 ring-border/20"
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-3 border-b border-border/60 bg-muted/60 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-400/80" />
            <div className="size-2.5 rounded-full bg-yellow-400/80" />
            <div className="size-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="flex h-6 flex-1 items-center justify-center gap-1.5 rounded-md bg-background/80 px-3 text-[11px] text-muted-foreground">
            <div className="size-2.5 rounded-full bg-muted" />
            meublog.com.br/ferramentas
          </div>
        </div>

        {/* Page content */}
        <div className="p-5">
          {/* Header skeleton */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="mb-1.5 h-3 w-28 rounded-full bg-muted" />
              <div className="h-2 w-40 rounded-full bg-muted/60" />
            </div>
            <div className="h-7 w-20 rounded-lg bg-primary/10" />
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay:    i * 0.07 + 0.25,
                  duration: 0.4,
                  ease:     [0.25, 0.1, 0.25, 1],
                }}
                className="flex flex-col items-center gap-2 rounded-xl border border-border/70 bg-card p-3 text-center shadow-xs"
              >
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tool.color}`}>
                  <tool.icon className="size-4" />
                </div>
                <span className="text-[10px] font-medium leading-tight text-foreground">
                  {tool.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-4 flex gap-2">
            <div className="h-8 flex-1 rounded-lg bg-primary/10" />
            <div className="h-8 w-16 rounded-lg bg-muted" />
          </div>
        </div>
      </motion.div>

      {/* Floating pill — tools count */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 5, 0] }}
        transition={{
          opacity: { delay: 0.8, duration: 0.4 },
          x:       { delay: 0.8, duration: 0.4 },
          y:       { delay: 1.2, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="hidden lg:block absolute -right-5 top-12 rounded-xl border border-border/60 bg-card px-3.5 py-2.5 shadow-elevated"
      >
        <div className="flex items-center gap-2 text-xs">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Layers className="size-3.5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">50+ ferramentas</p>
            <p className="text-[10px] text-muted-foreground">disponíveis agora</p>
          </div>
        </div>
      </motion.div>

      {/* Floating pill — free */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
        transition={{
          opacity: { delay: 1.0, duration: 0.4 },
          x:       { delay: 1.0, duration: 0.4 },
          y:       { delay: 1.4, duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="hidden lg:block absolute -bottom-5 -left-5 rounded-xl border border-border/60 bg-card px-3.5 py-2.5 shadow-elevated"
      >
        <div className="flex items-center gap-2 text-xs">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">100% gratuito</p>
            <p className="text-[10px] text-muted-foreground">sem cadastro</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
