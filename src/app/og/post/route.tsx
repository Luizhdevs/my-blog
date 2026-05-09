import { ImageResponse } from "next/og"
import { type NextRequest } from "next/server"

import { siteConfig }                              from "@/config/site"
import { loadOGFonts, getCategoryAccent, withOGCacheHeaders } from "@/lib/og-fonts"

export const runtime = "edge"

function trunc(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day:   "2-digit",
      month: "short",
      year:  "numeric",
    })
  } catch {
    return iso
  }
}

export async function GET(req: NextRequest) {
  const sp      = req.nextUrl.searchParams
  const title   = trunc(sp.get("t") ?? siteConfig.name, 80)
  const desc    = trunc(sp.get("d") ?? siteConfig.tagline, 140)
  const catSlug = sp.get("c") ?? ""
  const catName = sp.get("cn") ?? catSlug
  const readMin = sp.get("r") ?? ""
  const date    = sp.get("dt") ?? ""

  const accent = getCategoryAccent(catSlug)
  const fonts  = await loadOGFonts()

  const res = new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "linear-gradient(135deg, #003B4A 0%, #00526A 55%, #007B94 100%)",
          fontFamily: "Inter",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "460px", height: "460px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "110px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex" }} />

        {/* Top content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Category badge */}
          {catName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: `${accent}28`,
                border: `1.5px solid ${accent}70`,
                borderRadius: "100px",
                padding: "6px 18px",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: "14px", color: accent, fontFamily: "Inter", fontWeight: 600 }}>
                {catName}
              </span>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: "58px",
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: "Plus Jakarta Sans",
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "22px",
              color: "rgba(230, 243, 246, 0.7)",
              fontFamily: "Inter",
              lineHeight: 1.5,
              maxWidth: "900px",
            }}
          >
            {desc}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Meta: reading time + date */}
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {readMin && (
              <span style={{ fontSize: "14px", color: "rgba(230,243,246,0.5)", fontFamily: "Inter" }}>
                {readMin} min de leitura
              </span>
            )}
            {date && (
              <span style={{ fontSize: "14px", color: "rgba(230,243,246,0.5)", fontFamily: "Inter" }}>
                {formatDate(date)}
              </span>
            )}
          </div>

          {/* Site name */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accent, display: "flex" }} />
            <span style={{ fontSize: "16px", color: "rgba(230,243,246,0.75)", fontFamily: "Inter" }}>
              {siteConfig.name}
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  )

  return withOGCacheHeaders(res)
}
