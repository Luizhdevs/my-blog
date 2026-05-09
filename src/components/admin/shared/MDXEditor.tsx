"use client"

import { useState, useCallback } from "react"
import { Eye, Code }              from "lucide-react"

import { cn } from "@/lib/utils"

interface MDXEditorProps {
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  className?:   string
  postId?:      string  // if provided, enables "Preview in new tab" button
}

export function MDXEditor({ value, onChange, placeholder, className, postId }: MDXEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write")

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault()
        const target    = e.currentTarget
        const start     = target.selectionStart
        const end       = target.selectionEnd
        const newValue  = value.slice(0, start) + "  " + value.slice(end)
        onChange(newValue)
        // Restore cursor position after state update
        requestAnimationFrame(() => {
          target.selectionStart = start + 2
          target.selectionEnd   = start + 2
        })
      }
    },
    [value, onChange],
  )

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-lg border border-border", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
              tab === "write"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Code className="size-3.5" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
              tab === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="size-3.5" />
            Prévia
          </button>
        </div>
        {postId && (
          <a
            href={`/admin/posts/${postId}/preview`}
            target="_blank"
            rel="noopener"
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Preview completo ↗
          </a>
        )}
      </div>

      {/* Content */}
      {tab === "write" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Escreva o conteúdo em MDX..."}
          className="min-h-[420px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          spellCheck={false}
        />
      ) : (
        <div className="min-h-[420px] overflow-y-auto p-4">
          {value.trim() ? (
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted-foreground">
              {/* Basic text preview — full MDX render is via the preview route */}
              {value}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nada para pré-visualizar ainda.</p>
          )}
        </div>
      )}

      {/* Word count */}
      <div className="border-t border-border bg-muted/20 px-3 py-1.5 text-right">
        <span className="text-xs text-muted-foreground">
          {value.length.toLocaleString("pt-BR")} caracteres
        </span>
      </div>
    </div>
  )
}
