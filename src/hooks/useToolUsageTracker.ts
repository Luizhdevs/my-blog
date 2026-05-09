import { useEffect, useRef } from "react"
import { trackToolUsage }   from "@/features/admin/actions/tools"

export function useToolUsageTracker(slug: string, hasResult: boolean) {
  const tracked = useRef(false)

  useEffect(() => {
    if (hasResult && !tracked.current) {
      tracked.current = true
      trackToolUsage(slug).catch(() => {})
    }
  }, [hasResult, slug])
}
