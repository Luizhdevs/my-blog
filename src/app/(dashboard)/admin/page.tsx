import Link                    from "next/link"
import { FileText, Wrench, Users, BarChart2, Plus, ArrowRight } from "lucide-react"

import { getDashboardStats, getRecentPosts } from "@/features/admin"
import { StatsCard }        from "@/components/admin/shared/StatsCard"
import { PostStatusBadge }  from "@/components/admin/posts/PostStatusBadge"
import { Button }           from "@/components/ui/button"

export default async function AdminDashboard() {
  const [stats, recentPosts] = await Promise.all([
    getDashboardStats(),
    getRecentPosts(5),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral do painel</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/posts/new">
            <Plus className="size-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Posts totais"
          value={stats.posts.total}
          subtitle={`${stats.posts.published} publicados`}
          icon={<FileText className="size-4" />}
        />
        <StatsCard
          title="Rascunhos"
          value={stats.posts.draft}
          subtitle={`${stats.posts.scheduled} agendados`}
          icon={<BarChart2 className="size-4" />}
        />
        <StatsCard
          title="Ferramentas"
          value={stats.tools.total}
          subtitle={`${stats.tools.published} publicadas · ${stats.tools.usages.toLocaleString("pt-BR")} usos`}
          icon={<Wrench className="size-4" />}
        />
        <StatsCard
          title="Usuários"
          value={stats.users}
          icon={<Users className="size-4" />}
        />
      </div>

      {/* Recent posts */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading font-semibold">Posts recentes</h2>
          <Link
            href="/admin/posts"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver todos
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhum post criado ainda.</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/posts/new">Criar primeiro post</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentPosts.map(post => (
              <li key={post.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.author.name ?? "Admin"} · {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PostStatusBadge status={post.status} />
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
