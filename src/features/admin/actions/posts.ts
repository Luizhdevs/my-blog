"use server"

import { revalidateTag } from "next/cache"

import { db }            from "@/lib/db"
import { CACHE_TAGS }    from "@/lib/cache"
import { requireAdmin }  from "@/features/admin/lib/auth"
import {
  createPostSchema,
  updatePostSchema,
  type ActionResult,
  type CreatePostInput,
  type UpdatePostInput,
} from "@/lib/validations"

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-")
}

function splitCsv(str?: string): string[] {
  if (!str) return []
  return str.split(",").map(s => s.trim()).filter(s => s.length > 0)
}

function calcReadingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))
}

async function upsertTags(names: string[]) {
  return Promise.all(
    names.map(name =>
      db.tag.upsert({
        where:  { slug: slugify(name) },
        create: { slug: slugify(name), name },
        update: {},
      }),
    ),
  )
}

export async function createPost(
  input: CreatePostInput,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const author = await requireAdmin()

  const parsed = createPostSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const { tags, seoKeywords, publishedAt, categoryId, ...rest } = parsed.data
  const tagNames   = splitCsv(tags)
  const keywords   = splitCsv(seoKeywords)
  const tagRecords = await upsertTags(tagNames)

  const post = await db.post.create({
    data: {
      ...rest,
      readingTime: calcReadingTime(rest.content),
      seoKeywords: keywords,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      authorId:    author.id,
      categoryId:  categoryId ?? null,
      tags:        { connect: tagRecords.map(t => ({ id: t.id })) },
    },
  })

  revalidateTag(CACHE_TAGS.POSTS, "max")
  revalidateTag(CACHE_TAGS.POST(post.slug), "max")

  return { success: true, data: { id: post.id, slug: post.slug } }
}

export async function updatePost(
  input: UpdatePostInput,
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin()

  const parsed = updatePostSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const { id, tags, seoKeywords, publishedAt, categoryId, ...rest } = parsed.data
  const tagNames   = splitCsv(tags)
  const keywords   = splitCsv(seoKeywords)
  const tagRecords = await upsertTags(tagNames)

  const post = await db.post.update({
    where: { id },
    data:  {
      ...rest,
      readingTime: calcReadingTime(rest.content),
      seoKeywords: keywords,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      categoryId:  categoryId ?? null,
      tags: {
        set:     [],
        connect: tagRecords.map(t => ({ id: t.id })),
      },
    },
  })

  revalidateTag(CACHE_TAGS.POSTS, "max")
  revalidateTag(CACHE_TAGS.POST(post.slug), "max")

  return { success: true, data: { id: post.id, slug: post.slug } }
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin()

  const post = await db.post.update({
    where:  { id },
    data:   { deletedAt: new Date() },
    select: { slug: true },
  })

  revalidateTag(CACHE_TAGS.POSTS, "max")
  revalidateTag(CACHE_TAGS.POST(post.slug), "max")

  return { success: true, data: undefined }
}

export async function togglePostStatus(
  id: string,
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED",
): Promise<ActionResult> {
  await requireAdmin()

  const post = await db.post.update({
    where: { id },
    data:  {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
    select: { slug: true },
  })

  revalidateTag(CACHE_TAGS.POSTS, "max")
  revalidateTag(CACHE_TAGS.POST(post.slug), "max")

  return { success: true, data: undefined }
}

export async function incrementPostViews(id: string): Promise<void> {
  await db.post.update({
    where: { id },
    data:  { views: { increment: 1 } },
  })
}
