import { cn } from "@/lib/utils";
import { Photo, Scrim } from "@/components/landing/photo";

/**
 * The opener for every inner page.
 *
 * `plain` sits on the cream background (About, FAQ, Customize, Track);
 * `banner` puts the same type over a photograph, which is what the nav's
 * transparent treatment expects on Destinations, Experiences and the guide.
 */
export function PageHeader({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "left",
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
  align?: "left" | "center";
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  const centered = align === "center";

  if (image) {
    return (
      <header className="relative flex min-h-[24rem] items-end overflow-hidden bg-pine-900 sm:min-h-[28rem]">
        <Photo
          src={image}
          alt={imageAlt ?? ""}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <Scrim strength="strong" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-pine-950/75 via-pine-950/25 to-transparent"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-40 sm:px-6 sm:pb-16">
          <p className="mb-4 inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-brass-400">
            <span className="h-px w-8 bg-brass-500" />
            {eyebrow}
          </p>
          <h1 className="max-w-3xl font-display text-[2.5rem] font-semibold leading-[1.05] text-white sm:text-[3.5rem]">
            {title}
            {accent && (
              <>
                {" "}
                <span className="font-script text-[1.1em] font-normal text-brass-400">
                  {accent}
                </span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-linen/80">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </header>
    );
  }

  return (
    <header className={cn(centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl")}>
      <p
        className={cn(
          "section-label mb-4 inline-flex items-center gap-2.5",
          centered && "justify-center"
        )}
      >
        <span className="h-px w-8 bg-brass-500" />
        {eyebrow}
      </p>
      <h1 className="font-display text-[2.5rem] font-semibold leading-[1.06] text-pine-900 sm:text-[3.25rem]">
        {title}
        {accent && (
          <>
            {" "}
            <span className="font-script text-[1.1em] font-normal text-brass-500">{accent}</span>
          </>
        )}
      </h1>
      {subtitle && (
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-muted">{subtitle}</p>
      )}
      {children}
    </header>
  );
}
