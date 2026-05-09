import fs   from "fs"
import path from "path"

import matter       from "gray-matter"
import readingTime  from "reading-time"

import type { Post, PostMeta } from "@/types/blog"

const POSTS_DIR = path.join(process.cwd(), "content", "posts")

function parsePost(slug: string, raw: string): Post {
  const { data, content } = matter(raw)
  const fm = data as Record<string, unknown>

  const minutes = Math.ceil(readingTime(content).minutes)

  return {
    slug,
    title:       String(fm.title       ?? ""),
    description: String(fm.description ?? ""),
    publishedAt: String(fm.publishedAt ?? ""),
    updatedAt:   fm.updatedAt ? String(fm.updatedAt) : undefined,
    category:    String(fm.category    ?? ""),
    tags:        Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
    coverImage:  fm.coverImage ? String(fm.coverImage) : undefined,
    featured:    Boolean(fm.featured ?? false),
    draft:       Boolean(fm.draft   ?? false),
    author:      fm.author ? String(fm.author) : undefined,
    readingTime: minutes,
    content,
  }
}

function readAllRaw(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith(".mdx") || f.endsWith(".md"))
    .map(filename => {
      const slug = filename.replace(/\.mdx?$/, "")
      const raw  = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8")
      return parsePost(slug, raw)
    })
    .filter(p => !p.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getAllPosts(): PostMeta[] {
  return readAllRaw().map(({ content: _content, ...meta }) => meta)
}

export function getPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  const fallback = path.join(POSTS_DIR, `${slug}.md`)

  let raw: string | undefined
  if (fs.existsSync(filePath))  raw = fs.readFileSync(filePath, "utf-8")
  else if (fs.existsSync(fallback)) raw = fs.readFileSync(fallback, "utf-8")
  if (!raw) return undefined

  const post = parsePost(slug, raw)
  return post.draft ? undefined : post
}

export function getFeaturedPosts(limit = 3): PostMeta[] {
  return getAllPosts()
    .filter(p => p.featured)
    .slice(0, limit)
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(p => p.category === category)
}

export function getRelatedPosts(current: PostMeta, limit = 3): PostMeta[] {
  const all = getAllPosts().filter(p => p.slug !== current.slug)

  const scored = all.map(post => {
    let score = 0
    if (post.category === current.category) score += 3
    const sharedTags = post.tags.filter(t => current.tags.includes(t)).length
    score += sharedTags
    return { post, score }
  })

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post)
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith(".mdx") || f.endsWith(".md"))
    .map(f => f.replace(/\.mdx?$/, ""))
}
