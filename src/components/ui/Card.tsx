import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/src/lib/utils"

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "glass"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl overflow-hidden",
          {
            "bg-surface border border-white/5": variant === "default",
            "glass-card": variant === "glass",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }
