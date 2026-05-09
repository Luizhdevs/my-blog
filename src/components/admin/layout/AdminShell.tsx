"use client"

import { useState } from "react"

import { AdminSidebar, MenuButton } from "./AdminSidebar"
import { UserMenu }                 from "./AdminHeader"

interface AdminShellProps {
  children:     React.ReactNode
  userMenuSlot: React.ReactNode
}

export function AdminShell({ children, userMenuSlot }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <MenuButton onClick={() => setSidebarOpen(true)} />
          <div className="lg:hidden flex-1" />
          {userMenuSlot}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
