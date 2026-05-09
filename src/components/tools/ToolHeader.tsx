import type { ToolMeta } from "@/types/tools"
import { getCategoryBySlug } from "@/features/tools/config/categories"
import { cn } from "@/lib/utils"
import { ToolBreadcrumb } from "./ToolBreadcrumb"

interface ToolHeaderProps {
  tool: ToolMeta
}

export function ToolHeader({ tool }: ToolHeaderProps) {
  const category = getCategoryBySlug(tool.category)

  return (
    <div className="border-b border-border bg-card/50 py-8">
      <div className="container-x mx-auto max-w-5xl">
        <ToolBreadcrumb
          items={[
            { label: "Ferramentas", href: "/ferramentas" },
            { label: tool.name },
          ]}
          className="mb-5"
        />

        <div className="flex items-start gap-5">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl",
              category?.color ?? "bg-muted text-foreground",
            )}
            aria-hidden
          >
            {tool.icon}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {tool.name}
              </h1>
              <span className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Grátis
              </span>
            </div>

            <p className="max-w-xl leading-relaxed text-muted-foreground">
              {tool.longDescription}
            </p>

            {category && (
              <span className="text-xs font-medium text-muted-foreground/70">
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
