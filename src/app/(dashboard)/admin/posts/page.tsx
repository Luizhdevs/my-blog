import { getAdminPosts } from "@/features/admin"
import { PostsTable }    from "@/components/admin/posts/PostsTable"

export default async function AdminPostsPage() {
  const posts = await getAdminPosts()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Posts</h1>
        <p className="text-sm text-muted-foreground">Gerencie os posts do blog</p>
      </div>
      <PostsTable posts={posts} />
    </div>
  )
}
