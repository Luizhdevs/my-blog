import type { ZodSchema } from "zod"

export type ToolTier = "FREE" | "PRO" | "ENTERPRISE"

export interface FAQItem {
  question: string
  answer:   string
}

/** Metadata-only shape — used by the registry for listings and routing */
export interface ToolMeta {
  id:              string
  slug:            string
  name:            string
  description:     string    // short — card preview & meta description
  longDescription: string    // full paragraph — tool page intro
  icon:            string    // emoji
  category:        string    // matches CategoryConfig.slug
  tier:            ToolTier
  keywords:        string[]
  faqs:            FAQItem[]
}

/** Full config with typed schema and compute — imported by form components */
export interface ToolConfig<TInput, TOutput> extends ToolMeta {
  schema:  ZodSchema<TInput>
  compute: (input: TInput) => TOutput
}

/** Lightweight shape for listing cards */
export interface ToolCard {
  slug:        string
  name:        string
  description: string
  icon:        string
  category:    string
  tier:        ToolTier
  usageCount:  number
}
