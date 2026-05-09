"use client"

import { useTransition } from "react"

import type { Tool, Category } from "@prisma/client"
import { toggleToolPublished }  from "@/features/admin/actions/tools"
import { cn }                   from "@/lib/utils"

type ToolWithRelations = Tool & { category: Category | null }

interface ToolsTableProps {
  tools: ToolWithRelations[]
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  )
}

export function ToolsTable({ tools }: ToolsTableProps) {
  const [, startTransition] = useTransition()

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await toggleToolPublished(id, !current)
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ferramenta</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Categoria</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Tier</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Usos</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Publicado</th>
            </tr>
          </thead>
          <tbody>
            {tools.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma ferramenta registrada.
                </td>
              </tr>
            ) : (
              tools.map(tool => (
                <tr key={tool.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {tool.icon && <span className="text-lg">{tool.icon}</span>}
                      <div>
                        <p className="font-medium">{tool.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {tool.category?.name ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      tool.tier === "FREE" ? "bg-muted text-muted-foreground" :
                      tool.tier === "PRO"  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                             "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
                    )}>
                      {tool.tier}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {tool.usageCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <ToggleSwitch
                        checked={tool.isPublished}
                        onChange={() => handleToggle(tool.id, tool.isPublished)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
