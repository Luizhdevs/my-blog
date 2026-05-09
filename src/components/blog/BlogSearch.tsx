"use client"

import { useState, useMemo } from "react"
import { Search }            from "lucide-react"

import type { PostMeta }      from "@/types/blog"
import type { BLOG_CATEGORIES } from "@/features/blog/config/categories"
import { PostGrid }           from "./PostGrid"

type Category = (typeof BLOG_CATEGORIES)[number]

interface BlogSearchProps {
  posts:      PostMeta[]
  categories: readonly Category[]
}

export function BlogSearch({ posts, categories }: BlogSearchProps) {
  const [query,    setQuery]    = useState("")
  const [category, setCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return posts.filter(post => {
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q)       ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))

      const matchesCategory = !category || post.category === category

      return matchesQuery && matchesCategory
    })
  }, [posts, query, category])

  return (
    <div className="flex flex-col gap-8">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar artigos…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground hover:border-primary/50"
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug === category ? null : cat.slug)}
              aria-pressed={category === cat.slug}
              className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground hover:border-primary/50"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p aria-live="polite" className="sr-only">
        {filtered.length} {filtered.length === 1 ? "artigo encontrado" : "artigos encontrados"}
      </p>

      {/* Results */}
      {filtered.length > 0 ? (
        <PostGrid posts={filtered} />
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg font-semibold">Nenhum artigo encontrado</p>
          <p className="text-sm text-muted-foreground">
            Tente buscar por outro termo ou categoria.
          </p>
          <button
            onClick={() => { setQuery(""); setCategory(null) }}
            className="mt-2 text-sm font-medium text-primary underline underline-offset-4"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
