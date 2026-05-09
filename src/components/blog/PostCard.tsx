import Link   from "next/link"
import Image  from "next/image"
import { Calendar, Clock } from "lucide-react"

import type { PostMeta } from "@/types/blog"
import { CategoryBadge } from "./CategoryBadge"
import { cn }            from "@/lib/utils"

interface PostCardProps {
  post:        PostMeta
  featured?:   boolean
  className?:  string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  })
}

export function PostCard({ post, featured = false, className }: PostCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md",
        featured && "lg:flex-row",
        className,
      )}
    >
      {/* Cover image */}
      {post.coverImage && (
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            featured ? "h-56 lg:h-auto lg:w-2/5 lg:shrink-0" : "h-48",
          )}
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={featured ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <CategoryBadge slug={post.category} />
          {post.featured && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Destaque
            </span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`} className="group/title">
          <h2
            className={cn(
              "font-heading font-bold leading-snug tracking-tight text-foreground transition-colors group-hover/title:text-primary",
              featured ? "text-xl sm:text-2xl" : "text-lg",
            )}
          >
            {post.title}
          </h2>
        </Link>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {post.readingTime} min de leitura
          </span>
        </div>
      </div>
    </article>
  )
}
