export interface Post {
  id:          string
  slug:        string
  title:       string
  description: string
  content:     string
  coverImage:  string | null
  publishedAt: Date | null
  featured:    boolean
  views:       number
  readingTime: number
  author: {
    id:        string
    name:      string | null
    avatarUrl: string | null
  }
  category: {
    id:   string
    slug: string
    name: string
  } | null
  tags: { id: string; slug: string; name: string }[]
}

export interface PostCard
  extends Pick<Post, "slug" | "title" | "description" | "coverImage" | "publishedAt" | "readingTime" | "featured"> {
  author:   Pick<Post["author"], "name" | "avatarUrl">
  category: Post["category"]
  tags:     Post["tags"]
}
