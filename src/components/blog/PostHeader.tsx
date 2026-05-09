import Image       from "next/image"
import Link        from "next/link"
import { Calendar, Clock, ChevronRight } from "lucide-react"

import type { PostMeta }  from "@/types/blog"
import { CategoryBadge } from "./CategoryBadge"
import { siteConfig }    from "@/config/site"

interface PostHeaderProps {
  post: PostMeta
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  })
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50">
      <div className="container-x mx-auto max-w-5xl py-10 md:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground transition-colors">Início</Link></li>
            <li><ChevronRight className="size-3" /></li>
            <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            <li><ChevronRight className="size-3" /></li>
            <li className="truncate font-medium text-foreground max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        <CategoryBadge slug={post.category} className="mb-4" />

        <h1 className="font-heading text-3xl font-bold tracking-tight text-balance leading-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {post.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {post.author ?? siteConfig.author.name}
          </span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {post.readingTime} min de leitura
          </span>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}
    </header>
  )
}
