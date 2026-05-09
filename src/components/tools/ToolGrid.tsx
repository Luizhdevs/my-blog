import { cn } from "@/lib/utils"
import type { ToolMeta } from "@/types/tools"
import { ToolCard } from "./ToolCard"

interface ToolGridProps {
  tools:      ToolMeta[]
  className?: string
}

export function ToolGrid({ tools, className }: ToolGridProps) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {tools.map(tool => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  )
}
