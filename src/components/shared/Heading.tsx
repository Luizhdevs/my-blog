import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-heading font-bold tracking-tight text-balance leading-tight",
  {
    variants: {
      size: {
        "4xl": "text-5xl sm:text-6xl lg:text-7xl",
        "3xl": "text-4xl sm:text-5xl lg:text-6xl",
        "2xl": "text-3xl sm:text-4xl lg:text-5xl",
        xl:    "text-2xl sm:text-3xl lg:text-4xl",
        lg:    "text-xl  sm:text-2xl lg:text-3xl",
        md:    "text-lg  sm:text-xl  lg:text-2xl",
        sm:    "text-base sm:text-lg",
        xs:    "text-sm  font-semibold",
      },
      align: {
        left:   "text-left",
        center: "text-center",
        right:  "text-right",
      },
      /* Renamed from "color" to avoid conflict with HTMLAttributes */
      textColor: {
        default:  "text-foreground",
        muted:    "text-muted-foreground",
        primary:  "text-primary",
        white:    "text-white",
        gradient: "text-gradient",
      },
    },
    defaultVariants: { size: "2xl", align: "left", textColor: "default" },
  },
)

interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export function Heading({
  className,
  size,
  align,
  textColor,
  as: Tag = "h2",
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(headingVariants({ size, align, textColor }), className)}
      {...props}
    />
  )
}
