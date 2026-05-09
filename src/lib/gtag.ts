export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag:      (...args: unknown[]) => void
  }
}

type GtagEventParams = {
  event_category?: string
  event_label?:    string
  value?:          number
  [key: string]:   unknown
}

export function trackPageView(pathname: string) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return
  window.gtag("config", GA_ID, { page_path: pathname })
}

export function trackEvent(action: string, params?: GtagEventParams) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return
  window.gtag("event", action, params)
}
