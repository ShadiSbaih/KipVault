import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { lift } from "../styles/button";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-base font-semibold tracking-[-0.018em] leading-[1.2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-butter text-ink border-[1.5px] border-ink hover:bg-[#f5cf42]",
        butterOutline:
          "bg-transparent text-butter border-[1.5px] border-butter hover:bg-butter hover:text-ink",
        ink:
          "bg-ink text-butter border-[1.5px] border-ink hover:bg-charcoal",
        destructive:
          "bg-destructive text-destructive-foreground border-[1.5px] border-ink hover:bg-destructive/90",
        outline:
          "border-[1.5px] border-ink bg-paper text-ink hover:bg-fog",
        secondary:
          "bg-fog text-ink border border-transparent hover:border-ink",
        ghost:
          "bg-transparent text-ink hover:bg-fog",
        link: "text-signal font-medium underline-offset-4 hover:underline rounded-none",
        lift: lift,
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10 p-0",
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
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
