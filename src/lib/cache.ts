import { unstable_cache } from "next/cache"

/**
 * TTLs padronizados para revalidação de cache.
 * Ajuste conforme a frequência de atualização do conteúdo.
 */
export const CACHE_TTL = {
  SHORT:   60,        // 1 min — dados dinâmicos (contadores, trending)
  MEDIUM:  60 * 30,   // 30 min — listagens de posts/ferramentas
  LONG:    60 * 60,   // 1h — páginas de marketing
  STATIC:  60 * 60 * 24, // 24h — conteúdo raramente alterado
} as const

/**
 * Tags de cache para invalidação granular via revalidateTag().
 */
export const CACHE_TAGS = {
  POSTS:      "posts",
  POST:       (slug: string) => `post:${slug}`,
  TOOLS:      "tools",
  TOOL:       (slug: string) => `tool:${slug}`,
  CATEGORIES: "categories",
} as const

/** Wrapper tipado sobre unstable_cache do Next.js */
export function createCachedFn<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyParts: string[],
  options: { tags?: string[]; revalidate?: number },
) {
  return unstable_cache(fn, keyParts, options)
}
