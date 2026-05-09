import { getAdminTools, getAdminToolStats } from "@/features/admin"
import { ToolsTable }   from "@/components/admin/tools/ToolsTable"
import { StatsCard }    from "@/components/admin/shared/StatsCard"
import { Wrench }       from "lucide-react"

export default async function AdminToolsPage() {
  const [tools, stats] = await Promise.all([
    getAdminTools(),
    getAdminToolStats(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Ferramentas</h1>
        <p className="text-sm text-muted-foreground">Gerencie a visibilidade das ferramentas</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total de ferramentas"
          value={stats.total}
          icon={<Wrench className="size-4" />}
        />
        <StatsCard
          title="Publicadas"
          value={stats.published}
          subtitle={`${stats.total - stats.published} ocultas`}
        />
        <StatsCard
          title="Usos totais"
          value={stats.usages.toLocaleString("pt-BR")}
        />
      </div>

      <ToolsTable tools={tools} />

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Nota:</strong> As ferramentas são definidas no código (
          <code className="rounded bg-muted px-1 py-0.5 text-xs">src/features/tools/tools/</code>
          ). Aqui você controla quais estão visíveis e acompanha estatísticas de uso.
        </p>
      </div>
    </div>
  )
}
