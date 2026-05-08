import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      none:    "",
      xs:      "py-6 md:py-8",
      sm:      "py-10 md:py-14",
      default: "py-16 md:py-24",
      lg:      "py-24 md:py-32",
      xl:      "py-32 md:py-40",
    },
    background: {
      default:  "",
      muted:    "bg-muted/40",
      accent:   "bg-accent/30",
      primary:  "bg-primary text-primary-foreground",
      brand:    "gradient-brand text-white",
      card:     "bg-card",
    },
  },
  defaultVariants: { spacing: "default", background: "default" },
})

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "article" | "aside"
}

export function Section({
  className,
  spacing,
  background,
  as: Tag = "section",
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(sectionVariants({ spacing, background }), className)}
      {...props}
    />
  )
}
