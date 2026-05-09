import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import type { User } from "@prisma/client"

export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const prismaUser = await db.user.findUnique({ where: { email: user.email } })
  if (!prismaUser || (prismaUser.role !== "ADMIN" && prismaUser.role !== "EDITOR")) return null

  return prismaUser
}

export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser()
  if (!user) throw new Error("Unauthorized")
  return user
}
