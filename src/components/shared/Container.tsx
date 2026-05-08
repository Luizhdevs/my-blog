import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto w-full container-x", {
  variants: {
    size: {
      sm:      "max-w-3xl",
      md:      "max-w-5xl",
      default: "max-w-7xl",
      lg:      "max-w-screen-2xl",
      full:    "max-w-full",
    },
  },
  defaultVariants: { size: "default" },
})

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />
}
