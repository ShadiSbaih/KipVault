import { cn } from "@/lib/utils";

interface KipVaultLogoProps {
  variant?: "default" | "inverted" | "mark";
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: "size-8", text: "text-xl tracking-[-0.03em]" },
  md: { icon: "size-9", text: "text-2xl tracking-[-0.03em]" },
  lg: { icon: "size-12", text: "text-3xl tracking-[-0.035em]" },
};

/**
 * Geometric KipVault brand mark and wordmark styled to DESIGN.md poster tokens.
 */
export function KipVaultLogo({
  variant = "default",
  size = "md",
  showWordmark = true,
  className,
}: KipVaultLogoProps) {
  const isInverted = variant === "inverted";
  const isMarkOnly = variant === "mark" || !showWordmark;
  const dims = sizeMap[size];

  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn(dims.icon, "shrink-0")}
      >
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="16"
          fill="#fbda5f"
          stroke={isInverted ? "#fbda5f" : "#0d0d0d"}
          strokeWidth="4"
        />
        <rect
          x="13"
          y="13"
          width="38"
          height="38"
          rx="9"
          fill={isInverted ? "#000000" : "#ffffff"}
          stroke="#0d0d0d"
          strokeWidth="3.5"
        />
        <path
          d="M32 21.5a6.5 6.5 0 0 0-3.25 12.13V41.5a3.25 3.25 0 0 0 6.5 0v-7.87A6.5 6.5 0 0 0 32 21.5Z"
          fill={isInverted ? "#fbda5f" : "#0d0d0d"}
        />
        <rect
          x="46"
          y="25"
          width="7"
          height="14"
          rx="3.5"
          fill={isInverted ? "#fbda5f" : "#0d0d0d"}
        />
      </svg>

      {!isMarkOnly && (
        <span
          className={cn(
            "font-display font-bold uppercase leading-none",
            dims.text,
            isInverted ? "text-butter" : "text-ink"
          )}
        >
          KipVault
        </span>
      )}
    </span>
  );
}
