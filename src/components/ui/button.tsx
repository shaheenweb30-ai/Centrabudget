import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-heading font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg rounded-full",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        brand: "bg-[#1752F3] text-white hover:bg-[#1752F3]/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        "brand-outline": "border-2 border-[#1752F3] bg-background text-[#1752F3] hover:bg-[#1752F3] hover:text-white",
        "brand-secondary": "bg-[#F0F0F0] text-[#1752F3] hover:bg-[#F0F0F0]/90 shadow-md hover:shadow-lg",
        "brand-accent": "bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 rounded-full px-4 text-sm",
        lg: "h-14 rounded-full px-10 text-lg",
        xl: "h-16 rounded-full px-12 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
