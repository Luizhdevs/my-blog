"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export interface FAQItem {
  question: string
  answer:   string
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            id={`faq-q-${i}`}
            aria-expanded={open === i}
            aria-controls={`faq-a-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
            className={cn(
              "flex w-full items-center justify-between gap-4 px-6 py-5 text-left",
              "font-semibold text-foreground transition-colors duration-150",
              "hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-ring",
              open === i && "bg-muted/30 text-primary",
            )}
          >
            <span className="text-[0.9375rem]">{item.question}</span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                open === i && "rotate-180 text-primary",
              )}
              aria-hidden
            />
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-6 pb-5">
                  <p className="border-l-2 border-primary/25 pl-4 text-[0.9rem] leading-[1.7] text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
