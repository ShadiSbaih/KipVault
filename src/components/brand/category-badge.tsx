import Image from "next/image";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "lg";
  className?: string;
}

const categoryImageMap: Record<string, { src: string; alt: string }> = {
  document: { src: "/document.png", alt: "Document file" },
  image: { src: "/image.png", alt: "Image file" },
  video: { src: "/video.png", alt: "Video file" },
  other: { src: "/other.png", alt: "Archive or other file" },
};

/**
 * Framed category artwork badge rendering the DESIGN.md-themed PNG icons from public/.
 */
export function CategoryBadge({
  category,
  size = "lg",
  className,
}: CategoryBadgeProps) {
  const asset = categoryImageMap[category] ?? categoryImageMap.other;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-chip border-[1.5px] border-ink bg-paper",
        size === "lg" ? "size-20 p-1.5" : "size-12 p-1",
        className
      )}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        width={size === "lg" ? 72 : 44}
        height={size === "lg" ? 72 : 44}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
