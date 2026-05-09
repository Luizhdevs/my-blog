"use server"

import { revalidateTag } from "next/cache"

import { db }            from "@/lib/db"
import { CACHE_TAGS }    from "@/lib/cache"
import { requireAdmin }  from "@/features/admin/lib/auth"
import type { ActionResult } from "@/lib/validations"

export async function toggleToolPublished(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  await requireAdmin()

  const tool = await db.tool.update({
    where:  { id },
    data:   { isPublished },
    select: { slug: true },
  })

  revalidateTag(CACHE_TAGS.TOOLS, "max")
  revalidateTag(CACHE_TAGS.TOOL(tool.slug), "max")

  return { success: true, data: undefined }
}

export async function incrementToolUsage(id: string, sessionId?: string): Promise<void> {
  await db.$transaction([
    db.tool.update({ where: { id }, data: { usageCount: { increment: 1 } } }),
    db.toolUsage.create({ data: { toolId: id, sessionId } }),
  ])
}

export async function trackToolUsage(slug: string): Promise<void> {
  const tool = await db.tool.findUnique({
    where:  { slug },
    select: { id: true },
  })
  if (!tool) return

  await db.$transaction([
    db.tool.update({ where: { id: tool.id }, data: { usageCount: { increment: 1 } } }),
    db.toolUsage.create({ data: { toolId: tool.id } }),
  ])
}
