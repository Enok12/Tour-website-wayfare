import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo, Scrim } from "@/components/landing/photo";
import type { Experience } from "@/content/site-content";
import { cn } from "@/lib/utils";

/**
 * Two presentations of the same content. `compact` is the icon list used in
 * the homepage's three-panel band; `feature` is the photographic card used on
 * the /experiences page.
 */
export function ExperienceCard({
  experience,
  variant = "compact",
  className,
}: {
  experience: Experience;
  variant?: "compact" | "feature";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <Link
        href={`/experiences#${experience.slug}`}
        className={cn(
          "group flex items-start gap-4 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-white/70",
          className
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pine-900/10 bg-white text-pine-700 transition-colors duration-300 group-hover:border-brass-500/40 group-hover:text-brass-600">
          <experience.icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[1.0625rem] font-semibold leading-tight text-pine-900">
            {experience.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-snug text-ink-muted">
            {experience.body}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <article
      id={experience.slug}
      className={cn(
        "group relative scroll-mt-32 overflow-hidden rounded-2xl shadow-card transition-shadow duration-300 hover:shadow-card-hover",
        className
      )}
    >
      <Photo
        src={experience.image}
        alt={experience.alt}
        className="aspect-[16/11] w-full"
        imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />
      <Scrim strength="strong" />

      <div className="absolute inset-x-0 bottom-0 p-7">
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-brass-400/50 bg-pine-950/40 text-brass-400 backdrop-blur-sm">
          <experience.icon className="h-5 w-5" strokeWidth={1.4} />
        </span>
        <h3 className="font-display text-[1.625rem] font-semibold leading-tight text-white">
          {experience.title}
        </h3>
        <p className="mt-2.5 max-w-md text-[0.875rem] leading-relaxed text-linen/80">
          {experience.body}
        </p>
        <Link
          href="/customize"
          className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brass-400 transition-colors hover:text-brass-100"
        >
          Build this into a trip
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
