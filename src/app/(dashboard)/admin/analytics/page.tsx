import { Activity, BarChart2, TrendingUp, Zap } from "lucide-react"

import { getAnalyticsStats, getUsageByDay, getTopTools } from "@/features/admin"
import { StatsCard }      from "@/components/admin/shared/StatsCard"
import { UsageChart }     from "@/components/admin/analytics/UsageChart"
import { TopToolsTable }  from "@/components/admin/analytics/TopToolsTable"

export default async function AnalyticsPage() {
  const [stats, dailyUsage, topTools] = await Promise.all([
    getAnalyticsStats(),
    getUsageByDay(30),
    getTopTools(10),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Estatísticas de uso das ferramentas
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de usos"
          value={stats.totalUsages.toLocaleString("pt-BR")}
          icon={<Activity className="size-4" />}
        />
        <StatsCard
          title="Usos hoje"
          value={stats.todayUsages.toLocaleString("pt-BR")}
          icon={<Zap className="size-4" />}
        />
        <StatsCard
          title="Últimos 7 dias"
          value={stats.weekUsages.toLocaleString("pt-BR")}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCard
          title="Ferramenta top"
          value={stats.topToolName ?? "—"}
          subtitle={
            stats.topToolName
              ? `${stats.topToolCount.toLocaleString("pt-BR")} usos no total`
              : "Nenhum uso ainda"
          }
          icon={<BarChart2 className="size-4" />}
        />
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-1 font-heading font-semibold">Usos nos últimos 30 dias</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Cada barra representa um dia
        </p>
        <UsageChart data={dailyUsage} />
      </div>

      {/* Top tools */}
      <TopToolsTable tools={topTools} />
    </div>
  )
}
