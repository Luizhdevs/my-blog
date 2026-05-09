import Link                 from "next/link"
import { ChevronLeft }       from "lucide-react"

import { getAdminCategories } from "@/features/admin"
import { PostForm }           from "@/components/admin/posts/PostForm"

export default async function NewPostPage() {
  const categories = await getAdminCategories()

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
        <h1 className="font-heading text-2xl font-bold">Novo post</h1>
        <p className="text-sm text-muted-foreground">Crie um novo post para o blog</p>
      </div>

      <PostForm mode="create" categories={categories} />
    </div>
  )
}
