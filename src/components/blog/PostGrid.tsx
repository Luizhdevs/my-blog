import type { PostMeta } from "@/types/blog"
import { PostCard }      from "./PostCard"
import { cn }            from "@/lib/utils"

interface PostGridProps {
  posts:      PostMeta[]
  className?: string
}

export function PostGrid({ posts, className }: PostGridProps) {
  if (posts.length === 0) return null

  const [featured, ...rest] = posts

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {featured && <PostCard post={featured} featured />}

      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
