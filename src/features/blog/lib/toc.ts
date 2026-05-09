import type { TOCEntry } from "@/types/blog"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()
}

export function extractTOC(mdxContent: string): TOCEntry[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const entries: TOCEntry[] = []

  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(mdxContent)) !== null) {
    const level = match[1].length as 2 | 3 | 4
    const text  = match[2].replace(/\*\*|__|\*|_|`/g, "").trim()
    const id    = slugify(text)
    entries.push({ id, text, level })
  }

  return entries
}
