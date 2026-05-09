import type { ToolMeta } from "@/types/tools"

import { compoundInterestMeta } from "../tools/compound-interest"
import { percentageMeta }       from "../tools/percentage"
import { currencyMeta }         from "../tools/currency"

const ALL_TOOLS: ToolMeta[] = [
  compoundInterestMeta,
  percentageMeta,
  currencyMeta,
]

const REGISTRY = new Map(ALL_TOOLS.map(t => [t.slug, t]))

export function getAllTools(): ToolMeta[] {
  return ALL_TOOLS
}

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return REGISTRY.get(slug)
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return ALL_TOOLS.filter(t => t.category === category)
}

export function getToolSlugs(): string[] {
  return ALL_TOOLS.map(t => t.slug)
}
