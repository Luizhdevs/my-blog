import type { PostMeta } from "@/types/blog"
import { PostCard }      from "./PostCard"

interface RelatedPostsProps {
  posts: PostMeta[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="mb-6 font-heading text-xl font-bold tracking-tight"
      >
        Artigos relacionados
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
