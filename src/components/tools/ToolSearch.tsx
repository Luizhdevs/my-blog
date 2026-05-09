"use client"

import { useMemo, useState } from "react"

import type { CategoryConfig } from "@/features/tools/config/categories"
import type { ToolMeta } from "@/types/tools"
import { SearchInput } from "@/components/shared/SearchInput"
import { cn } from "@/lib/utils"
import { ToolGrid } from "./ToolGrid"

interface ToolSearchProps {
  tools:      ToolMeta[]
  categories: CategoryConfig[]
}

export function ToolSearch({ tools, categories }: ToolSearchProps) {
  const [query,          setQuery]          = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter(tool => {
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q))
      const matchesCategory =
        !activeCategory || tool.category === activeCategory
      return matchesQuery && matchesCategory
    })
  }, [tools, query, activeCategory])

  const toggleCategory = (slug: string) =>
    setActiveCategory(prev => (prev === slug ? null : slug))

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <SearchInput
        placeholder="Buscar ferramenta..."
        value={query}
        onChange={setQuery}
        size="lg"
        className="max-w-lg"
      />

      {/* Category filters */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filtrar por categoria"
      >
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          aria-pressed={activeCategory === null}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
            activeCategory === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
          )}
        >
          Todas
        </button>

        {categories.map(cat => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => toggleCategory(cat.slug)}
            aria-pressed={activeCategory === cat.slug}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
              activeCategory === cat.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} ferramenta{filtered.length !== 1 ? "s" : ""}
        {activeCategory || query ? " encontrada" + (filtered.length !== 1 ? "s" : "") : ""}
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-base font-medium text-foreground">
            Nenhuma ferramenta encontrada
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente outro termo ou remova os filtros
          </p>
        </div>
      ) : (
        <ToolGrid tools={filtered} />
      )}
    </div>
  )
}
