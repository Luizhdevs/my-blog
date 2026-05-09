import { LogOut, User }  from "lucide-react"

import { signOut }       from "@/features/admin/actions/auth"
import { getAdminUser }  from "@/features/admin/lib/auth"
import { Button }        from "@/components/ui/button"
import { MenuButton }    from "./AdminSidebar"

interface AdminHeaderProps {
  onMenuClick?: never  // handled by client wrapper
}

async function UserMenu() {
  const user = await getAdminUser()

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-sm font-medium leading-none">{user?.name ?? "Admin"}</span>
        <span className="text-xs text-muted-foreground">{user?.email}</span>
      </div>
      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <User className="size-4" />
      </div>
      <form action={signOut}>
        <Button variant="ghost" size="icon" type="submit" aria-label="Sair">
          <LogOut className="size-4" />
        </Button>
      </form>
    </div>
  )
}

export function AdminHeaderClient({ breadcrumb }: { breadcrumb?: React.ReactNode }) {
  return null // handled in layout wrapper
}

export { UserMenu }
