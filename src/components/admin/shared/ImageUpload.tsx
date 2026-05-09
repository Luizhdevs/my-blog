"use client"

import { useState, useRef } from "react"
import Image                 from "next/image"
import { Upload, X, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button }       from "@/components/ui/button"
import { cn }           from "@/lib/utils"

interface ImageUploadProps {
  value?:      string
  onChange:    (url: string) => void
  onClear:     () => void
  bucket?:     string
  className?:  string
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  bucket    = "uploads",
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const inputRef                   = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Apenas imagens são permitidas")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Tamanho máximo: 5 MB")
      return
    }

    setError(null)
    setUploading(true)
    try {
      const supabase = createClient()
      const ext      = file.name.split(".").pop()
      const filename = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { cacheControl: "3600", upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
      onChange(urlData.publicUrl)
    } catch (err) {
      setError("Erro ao enviar imagem. Verifique se o bucket está configurado.")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {value ? (
        <div className="group relative overflow-hidden rounded-lg border border-border">
          <div className="relative h-40 w-full">
            <Image src={value} alt="Cover" fill className="object-cover" sizes="600px" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="bg-white/90 text-foreground hover:bg-white"
            >
              Trocar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onClear}
            >
              <X className="size-3.5" />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
          role="button"
          tabIndex={0}
          aria-label="Enviar imagem de capa"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <Upload className="size-5" />
              <span className="text-sm">Clique ou arraste uma imagem</span>
              <span className="text-xs">PNG, JPG, WebP até 5 MB</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
