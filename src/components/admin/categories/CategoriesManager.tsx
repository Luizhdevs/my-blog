"use client"

import { useState, useTransition } from "react"
import { Plus, Trash2, Loader2 }   from "lucide-react"

import type { Category } from "@prisma/client"
import { createCategory, deleteCategory } from "@/features/admin/actions/categories"
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog"
import { Button }        from "@/components/ui/button"
import { Input }         from "@/components/ui/input"
import { Label }         from "@/components/ui/label"
import { NativeSelect }  from "@/components/ui/native-select"
import { cn }            from "@/lib/utils"

interface CategoriesManagerProps {
  categories: Category[]
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const [, startTransition] = useTransition()
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const blogCats = categories.filter(c => c.type === "BLOG")
  const toolCats = categories.filter(c => c.type === "TOOL")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd   = new FormData(e.currentTarget)
    const data = {
      slug:  String(fd.get("slug") ?? ""),
      name:  String(fd.get("name") ?? ""),
      color: String(fd.get("color") ?? ""),
      type:  String(fd.get("type") ?? "BLOG") as "BLOG" | "TOOL",
    }

    const result = await createCategory(data)
    if (!result.success) setError(result.error)
    else (e.currentTarget as HTMLFormElement).reset()

    setLoading(false)
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Add category form */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 font-heading font-semibold">Nova categoria</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-name">Nome *</Label>
              <Input id="cat-name" name="name" required placeholder="Finanças" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-slug">Slug *</Label>
              <Input id="cat-slug" name="slug" required placeholder="financas" pattern="[a-z0-9-]+" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-type">Tipo *</Label>
              <NativeSelect id="cat-type" name="type" defaultValue="BLOG">
                <option value="BLOG">Blog</option>
                <option value="TOOL">Ferramenta</option>
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-color">Cor</Label>
              <Input id="cat-color" name="color" placeholder="emerald" />
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button type="submit" size="sm" disabled={loading} className="mt-1 self-start">
            {loading && <Loader2 className="size-4 animate-spin" />}
            <Plus className="size-4" />
            Criar categoria
          </Button>
        </form>
      </div>

      {/* Categories list */}
      <div className="flex flex-col gap-4">
        <CategoryList title="Blog" categories={blogCats} onDelete={handleDelete} />
        <CategoryList title="Ferramentas" categories={toolCats} onDelete={handleDelete} />
      </div>
    </div>
  )
}

function CategoryList({
  title,
  categories,
  onDelete,
}: {
  title:      string
  categories: Category[]
  onDelete:   (id: string) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma categoria.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
              <div className="flex items-center gap-2">
                {cat.icon && <span>{cat.icon}</span>}
                <div>
                  <p className="text-sm font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.slug}</p>
                </div>
                {cat.color && (
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    `bg-${cat.color}-100 text-${cat.color}-700`,
                  )}>
                    {cat.color}
                  </span>
                )}
              </div>
              <ConfirmDialog
                title="Excluir categoria"
                description={`Excluir "${cat.name}"? Posts vinculados ficarão sem categoria.`}
                confirmLabel="Excluir"
                destructive
                onConfirm={() => onDelete(cat.id)}
              >
                <Button variant="ghost" size="icon" aria-label="Excluir categoria" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </Button>
              </ConfirmDialog>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
