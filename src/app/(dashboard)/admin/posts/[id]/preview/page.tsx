import { notFound } from "next/navigation"
import Link          from "next/link"
import { Eye, Pencil } from "lucide-react"

import { getAdminPostById }  from "@/features/admin"
import { MDXContent }         from "@/components/blog/MDXContent"
import { PostHeader }         from "@/components/blog/PostHeader"
import { Container }          from "@/components/shared/Container"
import { Section }            from "@/components/shared/Section"
import { Button }             from "@/components/ui/button"
import { extractTOC }         from "@/features/blog"
import { TableOfContents }    from "@/components/blog/TableOfContents"
import type { PostMeta }      from "@/types/blog"

export default async function PostPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getAdminPostById(id)
  if (!post) notFound()

  const toc = extractTOC(post.content)

  // Adapt DB post to PostMeta shape for PostHeader
  const postMeta: PostMeta = {
    slug:        post.slug,
    title:       post.title,
    description: post.description,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    updatedAt:   post.updatedAt?.toISOString().split("T")[0],
    category:    post.category?.slug ?? "",
    tags:        post.tags.map(t => t.name),
    coverImage:  post.coverImage ?? undefined,
    featured:    post.featured,
    readingTime: post.readingTime,
  }

  return (
    <>
      {/* Preview banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-amber-400 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
        <div className="flex items-center gap-2">
          <Eye className="size-4 shrink-0" />
          <span>
            <strong>Modo de pré-visualização</strong> — Status: <strong>{post.status}</strong>
          </span>
        </div>
        <Button asChild size="sm" variant="outline" className="border-amber-400 bg-white dark:bg-transparent">
          <Link href={`/admin/posts/${id}/edit`}>
            <Pencil className="size-3.5" />
            Editar
          </Link>
        </Button>
      </div>

      <PostHeader post={postMeta} />

      <Section spacing="default">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_260px]">
            <article>
              <MDXContent source={post.content} />
            </article>
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents entries={toc} />
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}
