const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://meublog.com.br"

export const siteConfig = {
  name:        "My Blog",
  tagline:     "Ferramentas, blog e utilidades para o seu dia a dia",
  description:
    "Plataforma de blog, ferramentas digitais, calculadoras online e utilidades. Conteúdo de qualidade e ferramentas gratuitas.",
  url:         appUrl,
  ogImage:     `${appUrl}/og/default.png`,
  keywords: [
    "blog",
    "ferramentas online",
    "calculadoras",
    "utilidades",
    "tecnologia",
  ],
  author: {
    name: "Luiz Dev",
    url:  "https://meublog.com.br",
  },
  social: {
    twitter:  "@luizdev",
    github:   "https://github.com/luizdev",
    linkedin: "https://linkedin.com/in/luizdev",
  },
  brand: {
    primary:   "#003B4A",
    secondary: "#E6F3F6",
  },
} as const

export type SiteConfig = typeof siteConfig
