import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-[-0.018em] transition-colors focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "rounded-pill border-[1.5px] border-ink bg-butter text-ink",
        secondary: "rounded-pill border border-silver bg-fog text-ink",
        ink: "rounded-pill border border-pure-black bg-pure-black text-butter",
        chip: "rounded-chip border border-fog bg-paper text-ink",
        destructive:
          "rounded-pill border-[1.5px] border-ink bg-destructive text-destructive-foreground",
        outline: "rounded-pill border-[1.5px] border-ink bg-paper text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
