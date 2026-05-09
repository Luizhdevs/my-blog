export const BLOG_CATEGORIES = [
  {
    slug:        "financeiro",
    name:        "Finanças",
    description: "Investimentos, juros, câmbio e educação financeira",
    color:       "emerald",
  },
  {
    slug:        "matematica",
    name:        "Matemática",
    description: "Porcentagem, cálculos e fórmulas do dia a dia",
    color:       "blue",
  },
  {
    slug:        "tecnologia",
    name:        "Tecnologia",
    description: "Desenvolvimento web, ferramentas e tendências",
    color:       "violet",
  },
  {
    slug:        "produtividade",
    name:        "Produtividade",
    description: "Hacks, métodos e ferramentas para fazer mais",
    color:       "amber",
  },
] as const

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"]

export function getCategoryBySlug(slug: string) {
  return BLOG_CATEGORIES.find(c => c.slug === slug)
}
