import type { Metadata } from "next"

import { getAllPosts, BLOG_CATEGORIES } from "@/features/blog"
import { BlogSearch }   from "@/components/blog/BlogSearch"
import { Container }    from "@/components/shared/Container"
import { Heading }      from "@/components/shared/Heading"
import { Section }      from "@/components/shared/Section"
import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = createMetadata({
  title:       "Blog",
  description:
    "Artigos sobre finanças, matemática, tecnologia e produtividade. Conteúdo direto ao ponto com exemplos práticos.",
  slug:     "blog",
  keywords: ["blog", "artigos", "finanças", "matemática", "tecnologia"],
})

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main>
      {/* Hero */}
      <Section spacing="sm" className="border-b border-border bg-card/30">
        <Container>
          <div className="flex flex-col gap-4">
            <div className="w-fit rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Blog
            </div>
            <Heading as="h1" size="2xl" className="max-w-lg">
              Artigos e tutoriais
            </Heading>
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              {posts.length} {posts.length === 1 ? "artigo publicado" : "artigos publicados"}.
              Conteúdo sobre finanças, matemática e tecnologia.
            </p>
          </div>
        </Container>
      </Section>

      {/* Browser */}
      <Section spacing="default">
        <Container>
          <BlogSearch posts={posts} categories={BLOG_CATEGORIES} />
        </Container>
      </Section>
    </main>
  )
}
