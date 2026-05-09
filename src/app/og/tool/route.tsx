import { ImageResponse } from "next/og"
import { type NextRequest } from "next/server"

import { siteConfig }                              from "@/config/site"
import { loadOGFonts, getCategoryAccent, withOGCacheHeaders } from "@/lib/og-fonts"

export const runtime = "edge"

function trunc(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s
}

export async function GET(req: NextRequest) {
  const sp      = req.nextUrl.searchParams
  const name    = trunc(sp.get("n") ?? "Ferramenta", 55)
  const desc    = trunc(sp.get("d") ?? "", 130)
  const icon    = sp.get("i") ?? "🔧"
  const catSlug = sp.get("c") ?? ""
  const catName = sp.get("cn") ?? catSlug

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

        {/* Main content */}
        <div style={{ display: "flex", gap: "52px", alignItems: "flex-start" }}>
          {/* Icon box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "116px",
              height: "116px",
              borderRadius: "28px",
              background: `${accent}28`,
              border: `2px solid ${accent}50`,
              fontSize: "60px",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

          {/* Text area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            {/* Category badge */}
            {catName && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: `${accent}28`,
                  border: `1.5px solid ${accent}70`,
                  borderRadius: "100px",
                  padding: "5px 14px",
                  width: "fit-content",
                }}
              >
                <span style={{ fontSize: "13px", color: accent, fontFamily: "Inter", fontWeight: 600 }}>
                  {catName}
                </span>
              </div>
            )}

            {/* Tool name */}
            <div
              style={{
                fontSize: "58px",
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: "Plus Jakarta Sans",
                lineHeight: 1.1,
              }}
            >
              {name}
            </div>

            {/* Description */}
            {desc && (
              <div
                style={{
                  fontSize: "22px",
                  color: "rgba(230, 243, 246, 0.7)",
                  fontFamily: "Inter",
                  lineHeight: 1.5,
                }}
              >
                {desc}
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px", color: "rgba(230,243,246,0.45)", fontFamily: "Inter" }}>
            Ferramenta gratuita
          </span>

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
