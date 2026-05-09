import { db } from "@/lib/db"

export type DailyUsage = { date: string; count: number }

export type TopTool = {
  id:          string
  slug:        string
  name:        string
  icon:        string | null
  usageCount:  number
  isPublished: boolean
  recentCount: number
}

export type AnalyticsStats = {
  totalUsages:   number
  todayUsages:   number
  weekUsages:    number
  topToolName:   string | null
  topToolCount:  number
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const now = new Date()
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const startOfWeek  = new Date(startOfToday)
  startOfWeek.setUTCDate(startOfToday.getUTCDate() - 6)

  const [totalUsages, todayUsages, weekUsages, topTool] = await Promise.all([
    db.toolUsage.count(),
    db.toolUsage.count({ where: { createdAt: { gte: startOfToday } } }),
    db.toolUsage.count({ where: { createdAt: { gte: startOfWeek } } }),
    db.tool.findFirst({
      where:   { deletedAt: null },
      orderBy: { usageCount: "desc" },
      select:  { name: true, usageCount: true },
    }),
  ])

  return {
    totalUsages,
    todayUsages,
    weekUsages,
    topToolName:  topTool?.name  ?? null,
    topToolCount: topTool?.usageCount ?? 0,
  }
}

export async function getUsageByDay(days = 30): Promise<DailyUsage[]> {
  const now = new Date()
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1))

  const usages = await db.toolUsage.findMany({
    where:  { createdAt: { gte: startDate } },
    select: { createdAt: true },
  })

  const byDay: Record<string, number> = {}
  for (const u of usages) {
    const day = u.createdAt.toISOString().slice(0, 10)
    byDay[day] = (byDay[day] ?? 0) + 1
  }

  const result: DailyUsage[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setUTCDate(startDate.getUTCDate() + i)
    const day = d.toISOString().slice(0, 10)
    result.push({ date: day, count: byDay[day] ?? 0 })
  }

  return result
}

export async function getTopTools(limit = 10): Promise<TopTool[]> {
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 30)

  const [tools, recentUsages] = await Promise.all([
    db.tool.findMany({
      where:   { deletedAt: null },
      orderBy: { usageCount: "desc" },
      take:    limit,
      select:  { id: true, slug: true, name: true, icon: true, usageCount: true, isPublished: true },
    }),
    db.toolUsage.groupBy({
      by:    ["toolId"],
      _count: { id: true },
      where: { createdAt: { gte: since } },
    }),
  ])

  const recentMap = new Map(recentUsages.map(u => [u.toolId, u._count.id]))

  return tools.map(t => ({ ...t, recentCount: recentMap.get(t.id) ?? 0 }))
}
