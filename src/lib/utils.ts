import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combina classes Tailwind com merge de conflitos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Gera slug a partir de texto */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/** Calcula tempo de leitura em minutos */
export function calcReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/** Formata data no padrão pt-BR */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(date))
}

/** Formata número com separador de milhar */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

/** Trunca texto com reticências */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

/** Type-safe Object.entries */
export function typedEntries<T extends object>(obj: T) {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}
