"use client"

import { useActionState } from "react"
import Link               from "next/link"
import { Loader2 }        from "lucide-react"

import { signIn }   from "@/features/admin/actions/auth"
import { Button }   from "@/components/ui/button"
import { Input }    from "@/components/ui/input"
import { Label }    from "@/components/ui/label"
import { siteConfig } from "@/config/site"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null)

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold font-heading text-foreground">
          {siteConfig.name}
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">Acesse o painel administrativo</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@exemplo.com"
              autoComplete="email"
              required
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="h-10"
            />
          </div>

          {state && !state.success && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button type="submit" className="mt-1 h-10 w-full" disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Área restrita a administradores.
      </p>
    </div>
  )
}
