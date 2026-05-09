import { notFound }        from "next/navigation"
import Link                from "next/link"
import { ChevronLeft }     from "lucide-react"

import { getAdminPostById, getAdminCategories } from "@/features/admin"
import { PostForm } from "@/components/admin/posts/PostForm"

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [post, categories] = await Promise.all([
    getAdminPostById(id),
    getAdminCategories(),
  ])

  if (!post) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/posts"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Voltar para posts
        </Link>
        <h1 className="font-heading text-2xl font-bold">Editar post</h1>
        <p className="text-sm text-muted-foreground line-clamp-1">{post.title}</p>
      </div>

      <PostForm
        mode="edit"
        categories={categories}
        post={{
          id:             post.id,
          title:          post.title,
          slug:           post.slug,
          description:    post.description,
          content:        post.content,
          status:         post.status,
          publishedAt:    post.publishedAt,
          featured:       post.featured,
          categoryId:     post.categoryId,
          tags:           post.tags,
          coverImage:     post.coverImage,
          seoTitle:       post.seoTitle,
          seoDescription: post.seoDescription,
          seoKeywords:    post.seoKeywords,
          readingTime:    post.readingTime,
        }}
      />
    </div>
  )
}
