export interface CategoryConfig {
  slug:        string
  name:        string
  description: string
  icon:        string
  color:       string
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug:        "financeiro",
    name:        "Financeiro",
    description: "Cálculos e planejamento financeiro",
    icon:        "💰",
    color:       "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  {
    slug:        "matematica",
    name:        "Matemática",
    description: "Cálculos matemáticos e estatísticos",
    icon:        "📐",
    color:       "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    slug:        "conversores",
    name:        "Conversores",
    description: "Conversão de unidades e formatos",
    icon:        "🔄",
    color:       "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  },
  {
    slug:        "texto",
    name:        "Texto",
    description: "Formatação e análise de texto",
    icon:        "✏️",
    color:       "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  },
  {
    slug:        "web",
    name:        "Web",
    description: "Utilitários para desenvolvedores web",
    icon:        "🌐",
    color:       "bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400",
  },
]

const CATEGORY_MAP = new Map(CATEGORIES.map(c => [c.slug, c]))

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORY_MAP.get(slug)
}
