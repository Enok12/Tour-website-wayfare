import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/reveal";

/**
 * The repeating section opener across the marketing site: a small gold
 * eyebrow, an editorial serif headline, and an optional right-aligned link.
 * Using one component for all of them is what keeps the vertical rhythm
 * identical from section to section.
 */
export function SectionHeading({
  label,
  title,
  accent,
  description,
  link,
  align = "left",
  tone = "light",
  className,
}: {
  label?: string;
  title: string;
  /** Rendered in the script face immediately after the title. */
  accent?: string;
  description?: string;
  link?: { href: string; label: string };
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "flex gap-6",
        centered
          ? "flex-col items-center text-center"
          : "flex-col items-start sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(centered ? "max-w-2xl" : "max-w-2xl")}>
        {label && (
          <p className={cn("section-label mb-3", tone === "dark" && "text-brass-400")}>{label}</p>
        )}
        <h2
          className={cn(
            "font-display text-[2rem] font-semibold leading-[1.12] sm:text-[2.6rem]",
            tone === "dark" ? "text-linen" : "text-pine-900"
          )}
        >
          {title}
          {accent && (
            <>
              {" "}
              <span
                className={cn(
                  "font-script text-[1.15em] font-normal",
                  tone === "dark" ? "text-brass-400" : "text-brass-500"
                )}
              >
                {accent}
              </span>
            </>
          )}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 text-[0.975rem] leading-relaxed",
              tone === "dark" ? "text-linen/70" : "text-ink-muted"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-sm font-medium transition-colors",
            tone === "dark"
              ? "text-brass-400 hover:text-brass-100"
              : "text-pine-700 hover:text-brass-600"
          )}
        >
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
