import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

interface PageMetadataOptions {
  title: string
  description: string
  slug?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}

/**
 * Factory de metadata para páginas individuais.
 * Garante consistência e elimina boilerplate em cada page.tsx.
 */
export function createMetadata({
  title,
  description,
  slug,
  image,
  keywords,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = slug ? `${siteConfig.url}/${slug}` : siteConfig.url
  const ogImage = image ?? siteConfig.ogImage

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
