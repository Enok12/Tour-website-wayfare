import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Every photographic surface on the marketing site goes through this, so a
 * package without a `coverImage` degrades to one deliberate, designed tile
 * rather than a broken image or an obvious grey box.
 *
 * Local assets (`/images/...`) go through `next/image`, which resizes them
 * and serves WebP -- the source photographs are 0.5-2MB each and would
 * otherwise be shipped whole. Remote images (Cloudinary URLs out of the
 * database) stay on a plain `img`: routing those through next/image would
 * mean registering every possible remote host in next.config, which is a
 * deployment concern rather than a redesign one.
 */
export function Photo({
  src,
  alt,
  className,
  imgClassName,
  /** Label drawn on the fallback tile when there is no photograph. */
  fallbackLabel,
  /** Viewport-width hint for the responsive srcset on local assets. */
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  children,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const isLocal = typeof src === "string" && src.startsWith("/");

  return (
    <div className={cn("relative overflow-hidden bg-pine-800", className)}>
      {src ? (
        isLocal ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn("object-cover", imgClassName)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className={cn("h-full w-full object-cover", imgClassName)}
          />
        )
      ) : (
        <Fallback label={fallbackLabel} />
      )}
      {children}
    </div>
  );
}

function Fallback({ label }: { label?: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, var(--pine-700) 0%, var(--pine-900) 55%, var(--pine-950) 100%)",
      }}
      aria-hidden="true"
    >
      <MapPin className="h-6 w-6 text-brass-400/70" strokeWidth={1.25} />
      {label && (
        <span className="font-display text-base leading-tight text-linen/70">{label}</span>
      )}
    </div>
  );
}

/** The gradient scrim that makes overlaid text legible on a photograph. */
export function Scrim({
  className,
  strength = "medium",
}: {
  className?: string;
  strength?: "light" | "medium" | "strong";
}) {
  const stops = {
    light: "from-pine-950/70 via-pine-950/10 to-transparent",
    medium: "from-pine-950/85 via-pine-950/25 to-pine-950/5",
    strong: "from-pine-950/95 via-pine-950/55 to-pine-950/20",
  }[strength];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 bg-gradient-to-t", stops, className)}
    />
  );
}
