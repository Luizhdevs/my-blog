"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { cn }     from "@/lib/utils"

interface ConfirmDialogProps {
  title:         string
  description:   string
  confirmLabel?: string
  cancelLabel?:  string
  destructive?:  boolean
  onConfirm:     () => Promise<void> | void
  children:      React.ReactNode  // trigger element
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel  = "Cancelar",
  destructive  = false,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const [open, setOpen]       = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      await onConfirm()
      setOpen(false)
    })
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-labelledby="confirm-title">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden />
          <div className={cn(
            "relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-elevated",
          )}>
            <h2 id="confirm-title" className="font-heading text-base font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={pending}>
                {cancelLabel}
              </Button>
              <Button
                variant={destructive ? "destructive" : "default"}
                size="sm"
                onClick={handleConfirm}
                disabled={pending}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
