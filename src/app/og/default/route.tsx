import { ImageResponse } from "next/og"

import { siteConfig }               from "@/config/site"
import { loadOGFonts, withOGCacheHeaders } from "@/lib/og-fonts"

export const runtime = "edge"

export async function GET() {
  const fonts = await loadOGFonts()

  const domain = siteConfig.url.replace(/^https?:\/\//, "")

  const res = new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #003B4A 0%, #00526A 55%, #007B94 100%)",
          fontFamily: "Inter",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "420px", height: "420px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: "-50px", right: "140px", width: "230px", height: "230px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex" }} />
        <div style={{ position: "absolute", top: "180px", left: "-60px", width: "170px", height: "170px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", display: "flex" }} />

        {/* Domain badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "100px",
            padding: "8px 22px",
            marginBottom: "36px",
            width: "fit-content",
          }}
        >
          <span style={{ fontSize: "15px", color: "#E6F3F6", fontFamily: "Inter", fontWeight: 400 }}>
            {domain}
          </span>
        </div>

        {/* Site name */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: 800,
            color: "#FFFFFF",
            fontFamily: "Plus Jakarta Sans",
            lineHeight: 1.1,
            marginBottom: "28px",
          }}
        >
          {siteConfig.name}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "26px",
            color: "rgba(230, 243, 246, 0.75)",
            fontFamily: "Inter",
            lineHeight: 1.5,
            maxWidth: "700px",
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  )

  return withOGCacheHeaders(res)
}
