"use client"

import { useEffect, useState } from "react"
import { cn }                  from "@/lib/utils"
import type { TOCEntry }       from "@/types/blog"

interface TableOfContentsProps {
  entries: TOCEntry[]
}

export function TableOfContents({ entries }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (entries.length === 0) return

    const headings = entries
      .map(e => document.getElementById(e.id))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      sections => {
        const visible = sections
          .filter(s => s.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    )

    headings.forEach(h => observer.observe(h))
    return () => observer.disconnect()
  }, [entries])

  if (entries.length < 2) return null

  return (
    <nav aria-label="Índice do artigo">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Neste artigo
      </p>
      <ul className="space-y-1.5">
        {entries.map(entry => (
          <li key={entry.id} style={{ paddingLeft: (entry.level - 2) * 12 }}>
            <a
              href={`#${entry.id}`}
              className={cn(
                "block text-sm leading-snug transition-colors hover:text-foreground",
                activeId === entry.id
                  ? "font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
