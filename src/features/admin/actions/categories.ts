"use server"

import { revalidateTag } from "next/cache"

import { db }            from "@/lib/db"
import { CACHE_TAGS }    from "@/lib/cache"
import { requireAdmin }  from "@/features/admin/lib/auth"
import {
  createCategorySchema,
  type ActionResult,
  type CreateCategoryInput,
} from "@/lib/validations"

export async function createCategory(
  input: CreateCategoryInput,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin()

  const parsed = createCategorySchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const existing = await db.category.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) return { success: false, error: "Já existe uma categoria com este slug" }

  const category = await db.category.create({ data: parsed.data })

  revalidateTag(CACHE_TAGS.CATEGORIES, "max")

  return { success: true, data: { id: category.id } }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin()

  const category = await db.category.findUnique({
    where:  { id },
    select: { _count: { select: { posts: true, tools: true } } },
  })

  if (!category) return { success: false, error: "Categoria não encontrada" }
  if (category._count.posts > 0 || category._count.tools > 0) {
    return { success: false, error: "Não é possível excluir uma categoria com posts ou ferramentas vinculados" }
  }

  await db.category.delete({ where: { id } })

  revalidateTag(CACHE_TAGS.CATEGORIES, "max")

  return { success: true, data: undefined }
}
