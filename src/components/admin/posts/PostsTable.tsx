"use client"

import { useState, useTransition, useMemo } from "react"
import Link                                  from "next/link"
import { Pencil, Trash2, Eye, Plus, Search } from "lucide-react"

import type { Post, Category, Tag, User } from "@prisma/client"
import { deletePost, togglePostStatus }   from "@/features/admin/actions/posts"
import { PostStatusBadge }                from "./PostStatusBadge"
import { ConfirmDialog }                  from "@/components/admin/shared/ConfirmDialog"
import { Button }                         from "@/components/ui/button"
import { Input }                          from "@/components/ui/input"
import { NativeSelect }                   from "@/components/ui/native-select"

type PostWithRelations = Post & {
  author:   Pick<User, "name" | "email">
  category: Category | null
  tags:     Tag[]
}

interface PostsTableProps {
  posts: PostWithRelations[]
}

export function PostsTable({ posts }: PostsTableProps) {
  const [query,  setQuery]  = useState("")
  const [status, setStatus] = useState<string>("all")
  const [, startTransition] = useTransition()

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchesQuery  = !query || p.title.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = status === "all" || p.status === status
      return matchesQuery && matchesStatus
    })
  }, [posts, query, status])

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePost(id)
    })
  }

  function handlePublish(id: string, current: Post["status"]) {
    const next = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
    startTransition(async () => {
      await togglePostStatus(id, next)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <NativeSelect
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-36"
          >
            <option value="all">Todos</option>
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="SCHEDULED">Agendado</option>
          </NativeSelect>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/posts/new">
            <Plus className="size-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Título</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Status</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Categoria</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Autor</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Data</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum post encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map(post => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium line-clamp-1">{post.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{post.description}</span>
                        <div className="sm:hidden mt-1">
                          <PostStatusBadge status={post.status} />
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <button
                        onClick={() => handlePublish(post.id, post.status)}
                        title={post.status === "PUBLISHED" ? "Clique para despublicar" : "Clique para publicar"}
                      >
                        <PostStatusBadge status={post.status} className="cursor-pointer hover:opacity-80" />
                      </button>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {post.category?.name ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {post.author.name ?? post.author.email}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/posts/${post.id}/preview`} target="_blank" aria-label="Pré-visualizar">
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`} aria-label="Editar">
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <ConfirmDialog
                          title="Excluir post"
                          description={`"${post.title}" será movido para a lixeira. Esta ação pode ser revertida manualmente no banco de dados.`}
                          confirmLabel="Excluir"
                          destructive
                          onConfirm={() => handleDelete(post.id)}
                        >
                          <Button variant="ghost" size="icon" aria-label="Excluir" className="text-destructive hover:text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  )
}
