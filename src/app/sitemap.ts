import type { MetadataRoute } from "next"

import { getAllTools }  from "@/features/tools"
import { getAllPosts }  from "@/features/blog"
import { siteConfig }  from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const toolUrls = getAllTools().map(tool => ({
    url:             `${siteConfig.url}/ferramentas/${tool.slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }))

  const postUrls = getAllPosts().map(post => ({
    url:             `${siteConfig.url}/blog/${post.slug}`,
    lastModified:    new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority:        post.featured ? 0.9 : 0.7,
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
    ...postUrls,
  ]
}
