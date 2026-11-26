import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const paragraphVariants = cva(
  "font-sans leading-[1.5] tracking-[-0.018em] text-ink [&:not(:first-child)]:mt-0",
  {
    variants: {
      variant: {
        default: "text-ink",
        lead: "text-lg leading-[1.5] tracking-[-0.02em] text-ink",
        muted: "text-sm text-mist",
        child: "[&:not(:first-child)]:mt-4",
      },
      size: {
        default: "text-base",
        small: "text-sm leading-[1.2] tracking-[-0.018em]",
        large: "text-lg font-semibold leading-[1.3] tracking-[-0.02em]",
        medium: "text-base",
      },
      weight: {
        default: "font-normal",
        bold: "font-bold",
        medium: "font-medium",
        light: "font-normal",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      weight: "default",
    },
  }
);

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

const P = ({ className, variant, size, weight, ...props }: ParagraphProps) => {
  return (
    <p
      className={cn(paragraphVariants({ weight, variant, size, className }))}
      {...props}
    />
  );
};

export { P, paragraphVariants };
