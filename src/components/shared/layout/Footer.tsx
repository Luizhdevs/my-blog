import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Container } from "@/components/shared/Container"
import { Logo } from "@/components/shared/Logo"
import { footerNav } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const socialLinks = [
  { label: "GitHub",   href: siteConfig.social.github },
  { label: "Twitter",  href: `https://x.com/${siteConfig.social.twitter.replace("@", "")}` },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer role="contentinfo" className="border-t border-border bg-muted/30">
      <Container>
        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-6 lg:py-16">

          {/* Brand column */}
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5",
                    "text-xs text-muted-foreground transition-colors duration-150",
                    "hover:bg-accent hover:text-foreground",
                  )}
                >
                  {label}
                  <ExternalLink className="size-2.5 opacity-60" aria-hidden />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav sections */}
          {footerNav.map((section) => (
            <div key={section.label} className="col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                {section.label}
              </h3>
              <ul role="list" className="mt-4 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="flex flex-col items-start gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year}{" "}
            <Link href="/" className="hover:text-foreground transition-colors">
              {siteConfig.name}
            </Link>
            . Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/privacidade"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacidade
            </Link>
            <Link
              href="/termos"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Termos
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
