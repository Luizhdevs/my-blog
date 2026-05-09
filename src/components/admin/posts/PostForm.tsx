"use client"

import { useState, useEffect }   from "react"
import { useForm, Controller }    from "react-hook-form"
import { zodResolver }            from "@hookform/resolvers/zod"
import { useRouter }              from "next/navigation"
import { Loader2, ChevronDown }   from "lucide-react"

import type { Category } from "@prisma/client"
import {
  createPostSchema,
  type CreatePostInput,
  type UpdatePostInput,
} from "@/lib/validations"
import { createPost, updatePost } from "@/features/admin/actions/posts"
import { MDXEditor }   from "@/components/admin/shared/MDXEditor"
import { ImageUpload } from "@/components/admin/shared/ImageUpload"
import { Button }      from "@/components/ui/button"
import { Input }       from "@/components/ui/input"
import { Label }       from "@/components/ui/label"
import { Textarea }    from "@/components/ui/textarea"
import { NativeSelect } from "@/components/ui/native-select"
import { cn }          from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "create" | "edit"

interface ExistingPost {
  id:             string
  title:          string
  slug:           string
  description:    string
  content:        string
  status:         "DRAFT" | "PUBLISHED" | "SCHEDULED"
  publishedAt:    Date | null
  featured:       boolean
  categoryId:     string | null
  tags:           { name: string }[]
  coverImage:     string | null
  seoTitle:       string | null
  seoDescription: string | null
  seoKeywords:    string[]
  readingTime:    number
}

interface PostFormProps {
  mode:        Mode
  categories:  Category[]
  post?:       ExistingPost
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 100)
}

// ─── Form field wrapper ───────────────────────────────────────────────────────

function Field({
  label, error, hint, children, className,
}: {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {hint  && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PostForm({ mode, categories, post }: PostFormProps) {
  const router     = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [seoOpen,     setSeoOpen]     = useState(false)

  const defaultValues: Partial<CreatePostInput> = {
    title:          post?.title          ?? "",
    slug:           post?.slug           ?? "",
    description:    post?.description    ?? "",
    content:        post?.content        ?? "",
    status:         post?.status         ?? "DRAFT",
    publishedAt:    post?.publishedAt
                      ? new Date(post.publishedAt).toISOString().slice(0, 16)
                      : "",
    featured:       post?.featured       ?? false,
    categoryId:     post?.categoryId     ?? "",
    tags:           post?.tags.map(t => t.name).join(", ") ?? "",
    coverImage:     post?.coverImage     ?? "",
    seoTitle:       post?.seoTitle       ?? "",
    seoDescription: post?.seoDescription ?? "",
    seoKeywords:    post?.seoKeywords.join(", ") ?? "",
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostInput>({
    resolver:      zodResolver(createPostSchema),
    defaultValues: defaultValues as CreatePostInput,
  })

  // Auto-generate slug from title (only in create mode)
  const title = watch("title")
  useEffect(() => {
    if (mode === "create" && title) {
      setValue("slug", toSlug(title), { shouldValidate: false })
    }
  }, [title, mode, setValue])

  const status    = watch("status")
  const coverImage = watch("coverImage")

  async function onSubmit(data: CreatePostInput) {
    setServerError(null)

    const result =
      mode === "edit"
        ? await updatePost({ ...data, id: post!.id } as UpdatePostInput)
        : await createPost(data)

    if (!result.success) {
      setServerError(result.error)
      return
    }
    router.push("/admin/posts")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* ─── Basic info ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading font-semibold">Informações básicas</h2>

        <Field label="Título *" error={errors.title?.message}>
          <Input {...register("title")} placeholder="Título do post" className="h-10" />
        </Field>

        <Field label="Slug *" error={errors.slug?.message} hint="URL amigável: /blog/seu-slug">
          <div className="flex items-center overflow-hidden rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <span className="border-r border-input bg-muted px-3 py-2 text-sm text-muted-foreground">/blog/</span>
            <input
              {...register("slug")}
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="meu-post"
            />
          </div>
        </Field>

        <Field label="Descrição *" error={errors.description?.message} hint="Aparece nos resultados de busca e cards (máx. 500 caracteres)">
          <Textarea {...register("description")} rows={2} placeholder="Breve descrição do post..." />
        </Field>
      </section>

      {/* ─── Content ────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading font-semibold">Conteúdo MDX</h2>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MDXEditor
              value={field.value}
              onChange={field.onChange}
              postId={mode === "edit" ? post?.id : undefined}
            />
          )}
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </section>

      {/* ─── Metadata ───────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading font-semibold">Metadados</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Categoria" error={errors.categoryId?.message}>
            <NativeSelect {...register("categoryId")}>
              <option value="">Sem categoria</option>
              {categories
                .filter(c => c.type === "BLOG")
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </NativeSelect>
          </Field>

          <Field label="Tags" hint="Separe por vírgulas: finança, investimento">
            <Input {...register("tags")} placeholder="tag1, tag2, tag3" />
          </Field>
        </div>

        <Field label="Imagem de capa">
          <ImageUpload
            value={coverImage}
            onChange={url => setValue("coverImage", url)}
            onClear={() => setValue("coverImage", "")}
          />
          <input type="hidden" {...register("coverImage")} />
        </Field>
      </section>

      {/* ─── Publishing ─────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading font-semibold">Publicação</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status *" error={errors.status?.message}>
            <NativeSelect {...register("status")}>
              <option value="DRAFT">Rascunho</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="SCHEDULED">Agendado</option>
            </NativeSelect>
          </Field>

          {(status === "PUBLISHED" || status === "SCHEDULED") && (
            <Field
              label={status === "SCHEDULED" ? "Data de publicação *" : "Data de publicação"}
              error={errors.publishedAt?.message}
            >
              <Input
                {...register("publishedAt")}
                type="datetime-local"
                className="h-9"
              />
            </Field>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            {...register("featured")}
            type="checkbox"
            id="featured"
            className="size-4 rounded border-input accent-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
            Destacar este post
          </label>
        </div>
      </section>

      {/* ─── SEO (collapsible) ───────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setSeoOpen(o => !o)}
          className="flex w-full items-center justify-between p-5 text-left"
          aria-expanded={seoOpen}
        >
          <h2 className="font-heading font-semibold">SEO</h2>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", seoOpen && "rotate-180")} />
        </button>

        {seoOpen && (
          <div className="flex flex-col gap-4 border-t border-border p-5">
            <Field label="Título SEO" hint="Deixe vazio para usar o título do post (máx. 70 caracteres)">
              <Input {...register("seoTitle")} placeholder={watch("title")} maxLength={70} />
            </Field>
            <Field label="Descrição SEO" hint="Deixe vazio para usar a descrição (máx. 160 caracteres)">
              <Textarea {...register("seoDescription")} rows={2} placeholder={watch("description")} maxLength={160} />
            </Field>
            <Field label="Keywords SEO" hint="Separe por vírgulas">
              <Input {...register("seoKeywords")} placeholder="palavra1, palavra2" />
            </Field>
          </div>
        )}
      </section>

      {/* ─── Submit ─────────────────────────────────────────────── */}
      {serverError && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/posts")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {mode === "edit" ? "Salvar alterações" : "Criar post"}
        </Button>
      </div>
    </form>
  )
}
