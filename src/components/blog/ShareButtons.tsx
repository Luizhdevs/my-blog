"use client"

import { useState }  from "react"
import { Share2, Link2, Check } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn }         from "@/lib/utils"

interface ShareButtonsProps {
  slug:  string
  title: string
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const url = `${siteConfig.url}/blog/${slug}`

  const encodedUrl   = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard API unavailable */
    }
  }

  const btnBase =
    "inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-xs font-medium transition-colors hover:bg-muted"

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Compartilhar:</span>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(btnBase, "hover:border-sky-300 hover:text-sky-600")}
        aria-label="Compartilhar no Twitter/X"
      >
        <Share2 className="size-3.5" />
        Twitter / X
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(btnBase, "hover:border-blue-400 hover:text-blue-600")}
        aria-label="Compartilhar no LinkedIn"
      >
        <Share2 className="size-3.5" />
        LinkedIn
      </a>

      <button
        onClick={copyLink}
        className={cn(
          btnBase,
          copied && "border-emerald-400 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
        )}
        aria-label={copied ? "Link copiado!" : "Copiar link"}
      >
        {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
        {copied ? "Copiado!" : "Copiar link"}
      </button>
    </div>
  )
}
