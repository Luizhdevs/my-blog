/**
 * Variantes Framer Motion reutilizáveis.
 * Importar direto em componentes — evita redefinir a cada uso.
 */
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
}

export const fadeInUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export const fadeInDown = {
  hidden:  { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
}

/** Stagger para listas — aplica no container, filhos usam fadeInUp */
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren:   0.1,
    },
  },
}

export const slideInLeft = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export const slideInRight = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

/** Configuração padrão para viewport trigger */
export const defaultViewport = {
  once:   true,
  margin: "-80px",
} as const
