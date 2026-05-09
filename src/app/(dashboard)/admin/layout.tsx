import { redirect } from "next/navigation"

import { getAdminUser }  from "@/features/admin/lib/auth"
import { AdminShell }    from "@/components/admin/layout/AdminShell"
import { UserMenu }      from "@/components/admin/layout/AdminHeader"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getAdminUser()
  if (!user) redirect("/login")

  return (
    <AdminShell userMenuSlot={<UserMenu />}>
      {children}
    </AdminShell>
  )
}
