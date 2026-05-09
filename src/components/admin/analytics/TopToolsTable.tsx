import { cn } from "@/lib/utils"
import type { TopTool } from "@/features/admin"

interface TopToolsTableProps {
  tools: TopTool[]
}

export function TopToolsTable({ tools }: TopToolsTableProps) {
  if (!tools.length) {
    return (
      <div className="rounded-xl border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
        Nenhuma ferramenta registrada.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-heading font-semibold">Top ferramentas</h2>
        <p className="text-xs text-muted-foreground">Ordenado por total de usos</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th scope="col" className="px-5 py-3 font-medium">#</th>
              <th scope="col" className="px-5 py-3 font-medium">Ferramenta</th>
              <th scope="col" className="px-5 py-3 font-medium text-right">Últimos 30 dias</th>
              <th scope="col" className="px-5 py-3 font-medium text-right">Total</th>
              <th scope="col" className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool, i) => (
              <tr
                key={tool.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3 text-muted-foreground tabular-nums">{i + 1}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base" aria-hidden>{tool.icon ?? "🔧"}</span>
                    <span className="font-medium">{tool.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right font-mono tabular-nums text-muted-foreground">
                  {tool.recentCount.toLocaleString("pt-BR")}
                </td>
                <td className="px-5 py-3 text-right font-mono tabular-nums font-semibold">
                  {tool.usageCount.toLocaleString("pt-BR")}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      tool.isPublished
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {tool.isPublished ? "Publicada" : "Oculta"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
