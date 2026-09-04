import { cn } from "@/lib/utils";
import { BRAND } from "@/content/site-content";

/**
 * Wordmark + monogram. The mark is a stylised lotus/compass rose inside a
 * pointed arch -- a nod to Sri Lankan temple architecture without lifting a
 * specific motif. `dark` inverts it for placement over photography or the
 * pine footer.
 */
export function Logo({
  className,
  dark = false,
  showTagline = false,
}: {
  className?: string;
  dark?: boolean;
  showTagline?: boolean;
}) {
  const stroke = dark ? "#F6F1E8" : "#173F35";
  const accent = dark ? "#D9B45F" : "#C89B3C";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="34"
        height="38"
        viewBox="0 0 34 38"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* pointed arch */}
        <path
          d="M17 1.5C17 1.5 32 11 32 22.5C32 30.5 25.3 36.5 17 36.5C8.7 36.5 2 30.5 2 22.5C2 11 17 1.5 17 1.5Z"
          stroke={stroke}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* compass rose / lotus */}
        <path d="M17 10.5L20.2 19.4L17 28.3L13.8 19.4L17 10.5Z" stroke={accent} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M8.6 19.4H25.4" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="17" cy="19.4" r="1.6" fill={accent} />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.45rem] font-semibold tracking-tight",
            dark ? "text-linen" : "text-pine-900"
          )}
        >
          {BRAND.name}
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.22em]",
              dark ? "text-brass-400/80" : "text-brass-600"
            )}
          >
            {BRAND.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
