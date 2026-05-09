"use client"

import { usePathname } from "next/navigation"
import { useEffect }   from "react"
import { trackPageView } from "@/lib/gtag"

// Fires a GA4 page_view on every client-side navigation (SPA soft nav).
// The initial load is already tracked by the gtag config snippet.
export function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return null
}
