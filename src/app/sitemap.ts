import type { MetadataRoute } from "next"

import { getAllTools } from "@/features/tools"
import { siteConfig } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const toolUrls = getAllTools().map(tool => ({
    url:             `${siteConfig.url}/ferramentas/${tool.slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }))

  return [
    {
      url:             siteConfig.url,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        1,
    },
    {
      url:             `${siteConfig.url}/ferramentas`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${siteConfig.url}/blog`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.8,
    },
    ...toolUrls,
  ]
}
