import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label:    string
  href:     string
  icon?:    LucideIcon
  external?: boolean
  badge?:   string
}

export interface NavSection {
  label: string
  items: NavItem[]
}

/** Links principais do header */
export const mainNav: NavItem[] = [
  { label: "Início",      href: "/" },
  { label: "Blog",        href: "/blog" },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Sobre",       href: "/sobre" },
  { label: "Contato",     href: "/contato" },
]

/** Links do footer organizados por seção */
export const footerNav: NavSection[] = [
  {
    label: "Plataforma",
    items: [
      { label: "Blog",          href: "/blog" },
      { label: "Ferramentas",   href: "/ferramentas" },
      { label: "Calculadoras",  href: "/ferramentas/calculadoras" },
      { label: "Conversores",   href: "/ferramentas/conversores" },
    ],
  },
  {
    label: "Empresa",
    items: [
      { label: "Sobre",         href: "/sobre" },
      { label: "Contato",       href: "/contato" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacidade",   href: "/privacidade" },
      { label: "Termos de Uso", href: "/termos" },
    ],
  },
]

/** Categorias de ferramentas — base para hub e sidebar */
export const toolCategories: NavItem[] = [
  { label: "Financeiro",  href: "/ferramentas/financeiro",  badge: "Popular" },
  { label: "Matemática",  href: "/ferramentas/matematica" },
  { label: "Conversores", href: "/ferramentas/conversores" },
  { label: "Texto",       href: "/ferramentas/texto" },
  { label: "Web",         href: "/ferramentas/web" },
]
