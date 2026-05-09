// Google Fonts API: older UA returns woff/ttf instead of woff2 — satori-compatible
const FONTS_API = "https://fonts.googleapis.com/css2"
const SAFARI_UA = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const params = new URLSearchParams({ family: `${family}:wght@${weight}`, display: "swap" })
    const css = await fetch(`${FONTS_API}?${params}`, {
      headers: { "User-Agent": SAFARI_UA },
      next:    { revalidate: 86400 },
    }).then(r => r.text())

    const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.at(1)
    if (!fontUrl) return null

    return fetch(fontUrl, { next: { revalidate: 86400 } }).then(r => r.arrayBuffer())
  } catch {
    return null
  }
}

export type OGFont = {
  name:   string
  data:   ArrayBuffer
  weight: 400 | 700 | 800
  style:  "normal"
}

export async function loadOGFonts(): Promise<OGFont[]> {
  const [interRegular, interBold, jakartaExtraBold] = await Promise.all([
    fetchGoogleFont("Inter", 400),
    fetchGoogleFont("Inter", 700),
    fetchGoogleFont("Plus Jakarta Sans", 800),
  ])

  const fonts: OGFont[] = []
  if (interRegular)     fonts.push({ name: "Inter",             data: interRegular,     weight: 400, style: "normal" })
  if (interBold)        fonts.push({ name: "Inter",             data: interBold,        weight: 700, style: "normal" })
  if (jakartaExtraBold) fonts.push({ name: "Plus Jakarta Sans", data: jakartaExtraBold, weight: 800, style: "normal" })
  return fonts
}

// Category → accent color mapping (used across all OG templates)
const CATEGORY_COLORS: Record<string, string> = {
  financeiro:    "#10B981",
  matematica:    "#3B82F6",
  conversores:   "#8B5CF6",
  tecnologia:    "#8B5CF6",
  texto:         "#F59E0B",
  web:           "#EC4899",
  produtividade: "#F59E0B",
}

export function getCategoryAccent(slug: string | undefined): string {
  return (slug && CATEGORY_COLORS[slug]) ?? "#64748B"
}

// Wrap ImageResponse with explicit cache headers for social crawlers
export function withOGCacheHeaders(response: Response, maxAge = 86400): Response {
  const headers = new Headers(response.headers)
  headers.set("Cache-Control", `public, max-age=${maxAge}, stale-while-revalidate=3600`)
  headers.set("CDN-Cache-Control", `public, max-age=${maxAge}`)
  return new Response(response.body, { status: response.status, headers })
}
