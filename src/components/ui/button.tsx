import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground hover:opacity-90",
        brand: "bg-pine-900 text-linen shadow-sm hover:bg-pine-700 hover:shadow-md",
        brassSolid:
          "bg-brass-500 text-pine-950 shadow-sm hover:bg-brass-400 hover:shadow-md",
        brassOutline:
          "border border-brass-500 text-brass-600 bg-transparent hover:bg-brass-100",
        terracotta:
          "bg-terracotta text-white shadow-sm hover:bg-terracotta-dark hover:shadow-md",
        onImage:
          "border border-white/45 bg-white/10 text-white backdrop-blur-sm hover:border-white/70 hover:bg-white/20",
        destructive: "bg-danger text-white hover:opacity-90",
        outline: "border border-border-subtle bg-surface hover:bg-surface-muted text-text-primary",
        quiet:
          "border border-pine-900/15 bg-transparent text-pine-900 hover:border-pine-900/35 hover:bg-pine-900/5",
        secondary: "bg-surface-muted text-text-primary hover:bg-border-subtle",
        ghost: "hover:bg-surface-muted text-text-primary",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-7 text-[0.9rem]",
        xl: "h-14 px-9 text-base",
        icon: "h-9 w-9",
        iconLg: "h-12 w-12 rounded-full",
        pill: "h-11 rounded-full px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
