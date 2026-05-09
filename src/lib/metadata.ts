import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { BLOG_CATEGORIES }  from "@/features/blog/config/categories"
import { CATEGORIES as TOOL_CATEGORIES } from "@/features/tools/config/categories"
import type { PostMeta }    from "@/types/blog"
import type { ToolMeta }    from "@/types/tools"

interface PageMetadataOptions {
  title: string
  description: string
  slug?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}

/**
 * Factory de metadata para páginas individuais.
 * Garante consistência e elimina boilerplate em cada page.tsx.
 */
export function createMetadata({
  title,
  description,
  slug,
  image,
  keywords,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = slug ? `${siteConfig.url}/${slug}` : siteConfig.url
  const ogImage = image ?? siteConfig.ogImage

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

// ─── OG image URL builders ────────────────────────────────────────────────────

export function postOGImage(post: PostMeta): string {
  const catName = BLOG_CATEGORIES.find(c => c.slug === post.category)?.name ?? post.category
  const params  = new URLSearchParams({
    t:  post.title,
    d:  post.description,
    c:  post.category,
    cn: catName,
    r:  String(post.readingTime),
    dt: post.publishedAt,
  })
  return `${siteConfig.url}/og/post?${params}`
}

export function toolOGImage(tool: ToolMeta): string {
  const catName = TOOL_CATEGORIES.find(c => c.slug === tool.category)?.name ?? tool.category
  const params  = new URLSearchParams({
    n:  tool.name,
    d:  tool.description,
    i:  tool.icon,
    c:  tool.category,
    cn: catName,
  })
  return `${siteConfig.url}/og/tool?${params}`
}
