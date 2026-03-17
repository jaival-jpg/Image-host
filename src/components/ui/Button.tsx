import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "glass"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-primary to-primary-glow text-black hover:shadow-[0_0_20px_rgba(255,212,0,0.4)]": variant === "default",
            "border border-white/10 bg-transparent hover:bg-white/5 text-text-primary": variant === "outline",
            "hover:bg-white/5 text-text-secondary hover:text-text-primary": variant === "ghost",
            "bg-surface/40 backdrop-blur-md border border-white/10 hover:bg-surface/60 text-text-primary": variant === "glass",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-lg px-3": size === "sm",
            "h-14 rounded-2xl px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
