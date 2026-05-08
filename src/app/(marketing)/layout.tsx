import type { ReactNode } from "react"

import { MainLayout } from "@/components/shared/layout/MainLayout"

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
