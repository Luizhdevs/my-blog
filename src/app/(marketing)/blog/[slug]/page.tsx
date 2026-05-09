import type { Metadata }   from "next"
import { notFound }        from "next/navigation"
import Script              from "next/script"
import Link                from "next/link"
import { ArrowLeft }       from "lucide-react"

import {
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
  extractTOC,
} from "@/features/blog"
import { MDXContent }       from "@/components/blog/MDXContent"
import { PostHeader }       from "@/components/blog/PostHeader"
import { RelatedPosts }     from "@/components/blog/RelatedPosts"
import { TableOfContents }  from "@/components/blog/TableOfContents"
import { ReadingProgress }  from "@/components/blog/ReadingProgress"
import { ShareButtons }     from "@/components/blog/ShareButtons"
import { Container }        from "@/components/shared/Container"
import { Section }          from "@/components/shared/Section"
import { createMetadata, postOGImage } from "@/lib/metadata"
import { siteConfig }                 from "@/config/site"

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getPostSlugs().map(slug => ({ slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const ogUrl = postOGImage(post)

  return {
    ...createMetadata({
      title:       post.title,
      description: post.description,
      slug:        `blog/${post.slug}`,
      image:       ogUrl,
      keywords:    post.tags,
    }),
    openGraph: {
      type:          "article",
      title:         post.title,
      description:   post.description,
      url:           `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime:  post.updatedAt ?? post.publishedAt,
      tags:          post.tags,
      locale:        "pt_BR",
      siteName:      siteConfig.name,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const toc          = extractTOC(post.content)
  const relatedPosts = getRelatedPosts(post)

  const jsonLd = {
    "@context":     "https://schema.org",
    "@type":        "BlogPosting",
    headline:       post.title,
    description:    post.description,
    datePublished:  post.publishedAt,
    dateModified:   post.updatedAt ?? post.publishedAt,
    url:            `${siteConfig.url}/blog/${post.slug}`,
    inLanguage:     "pt-BR",
    author: {
      "@type": "Person",
      name:    post.author ?? siteConfig.author.name,
      url:     siteConfig.author.url,
    },
    publisher: {
      "@type": "Organization",
      name:    siteConfig.name,
      url:     siteConfig.url,
    },
    keywords:       post.tags.join(", "),
    ...(post.coverImage && { image: post.coverImage }),
  }

  return (
    <>
      <Script
        id={`jsonld-post-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />

      <main>
        <PostHeader post={post} />

        <Section spacing="default">
          <Container size="default">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_260px]">
              {/* Article body */}
              <article>
                <MDXContent source={post.content} />

                {/* Footer */}
                <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8">
                  <ShareButtons slug={post.slug} title={post.title} />

                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    Voltar para o Blog
                  </Link>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents entries={toc} />
                </div>
              </aside>
            </div>
          </Container>
        </Section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <Section spacing="sm" className="border-t border-border bg-muted/30">
            <Container>
              <RelatedPosts posts={relatedPosts} />
            </Container>
          </Section>
        )}
      </main>
    </>
  )
}
