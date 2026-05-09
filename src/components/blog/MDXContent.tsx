import { MDXRemote }            from "next-mdx-remote/rsc"
import rehypePrettyCode         from "rehype-pretty-code"
import rehypeSlug               from "rehype-slug"
import rehypeAutolinkHeadings   from "rehype-autolink-headings"
import remarkGfm                from "remark-gfm"

interface MDXContentProps {
  source: string
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="mdx-prose">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["anchor"] } }],
              [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
            ],
          },
        }}
      />
    </div>
  )
}
