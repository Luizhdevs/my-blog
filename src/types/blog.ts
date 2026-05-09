export interface PostFrontmatter {
  title:       string
  description: string
  publishedAt: string        // ISO date string "2025-05-01"
  updatedAt?:  string
  category:    string        // slug, e.g. "tecnologia"
  tags:        string[]
  coverImage?: string
  featured?:   boolean
  draft?:      boolean
  author?:     string        // override; defaults to siteConfig.author.name
}

export interface PostMeta extends PostFrontmatter {
  slug:        string
  readingTime: number        // minutes, rounded
}

export interface Post extends PostMeta {
  content: string            // raw MDX source
}

export interface TOCEntry {
  id:       string
  text:     string
  level:    2 | 3 | 4
}
