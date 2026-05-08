import type { ZodSchema } from "zod"

export type ToolTier = "FREE" | "PRO" | "ENTERPRISE"

export interface ToolConfig<TInput = unknown, TOutput = unknown> {
  id:          string
  slug:        string
  name:        string
  description: string
  icon:        string
  category:    string
  tier:        ToolTier
  keywords:    string[]
  schema:      ZodSchema<TInput>
  compute:     (input: TInput) => TOutput
}

export interface ToolCard {
  slug:        string
  name:        string
  description: string
  icon:        string
  category:    string
  tier:        ToolTier
  usageCount:  number
}
