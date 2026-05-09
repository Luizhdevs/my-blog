"use server"

import { revalidatePath } from "next/cache"
import { redirect }       from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { db }           from "@/lib/db"
import { signInSchema, type ActionResult } from "@/lib/validations"

export async function signIn(
  _prevState: ActionResult<never> | null,
  formData: FormData,
): Promise<ActionResult<never>> {
  const raw = {
    email:    formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = signInSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { success: false, error: "E-mail ou senha incorretos" }

  // Verify user has admin/editor role in our DB
  const prismaUser = await db.user.findUnique({ where: { email: data.user.email! } })
  if (!prismaUser || (prismaUser.role !== "ADMIN" && prismaUser.role !== "EDITOR")) {
    await supabase.auth.signOut()
    return { success: false, error: "Acesso não autorizado. Solicite permissão ao administrador." }
  }

  revalidatePath("/", "layout")
  redirect("/admin")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
