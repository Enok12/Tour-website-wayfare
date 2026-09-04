"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Photo, Scrim } from "@/components/landing/photo";
import { cn } from "@/lib/utils";

export interface HeroImage {
  image: string;
  alt: string;
  caption?: string;
}

const ROTATE_MS = 7000;

/**
 * Full-bleed cinematic hero. Slides cross-fade with a slow Ken Burns push on
 * the active frame; with a single slide it degrades to a still hero with the
 * same treatment. All motion is suppressed under prefers-reduced-motion.
 */
export function Hero({
  slides,
  eyebrow,
  title,
  accent,
  subtitle,
  primaryCta,
  secondaryCta,
  height = "full",
}: {
  slides: HeroImage[];
  eyebrow: string;
  title: ReactNode;
  /** Rendered in the script face on its own line beneath the title. */
  accent?: string;
  subtitle: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  height?: "full" | "short";
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count]
  );

  useEffect(() => {
    if (count < 2 || reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(id);
  }, [count, reduceMotion]);

  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden bg-pine-900",
        height === "full"
          ? "min-h-[38rem] sm:min-h-[44rem] lg:min-h-[calc(100vh-1rem)]"
          : "min-h-[26rem] sm:min-h-[32rem]"
      )}
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.image + i}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-in-out",
              i === index ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={i !== index}
          >
            <Photo
              src={slide.image}
              alt={i === 0 ? slide.alt : ""}
              priority={i === 0}
              sizes="100vw"
              className="h-full w-full"
              imgClassName={cn(i === index && !reduceMotion && "ken-burns")}
            />
          </div>
        ))}
        <Scrim strength="strong" />
        {/* Slight left-weighted darkening so the headline holds against a
            busy sky without dimming the whole photograph. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-pine-950/70 via-pine-950/20 to-transparent"
        />
      </div>

      {/* Copy */}
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-28 pt-40 sm:px-6 sm:pb-32 lg:pb-44">
        <p className="mb-5 inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-brass-400">
          <span className="h-px w-8 bg-brass-500" />
          {eyebrow}
        </p>

        <h1 className="max-w-3xl font-display text-[2.75rem] font-semibold leading-[1.02] text-white sm:text-6xl lg:text-[4.5rem]">
          {title}
          {accent && (
            <span className="mt-1 block">
              <span className="relative inline-block font-script text-[1.08em] font-normal text-linen">
                {accent}
                <svg
                  className="absolute -bottom-3 left-0 w-full text-brass-500"
                  height="10"
                  viewBox="0 0 300 10"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7C60 2.5 190 1.5 298 5.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          )}
        </h1>

        <p className="mt-9 max-w-md text-[1.0625rem] leading-relaxed text-linen/85">{subtitle}</p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button asChild size="pill" variant="brassSolid" className="group h-12 px-7">
            <Link href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="group inline-flex items-center gap-3 text-sm font-medium text-white transition-colors hover:text-brass-400"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 transition-colors group-hover:border-brass-400 group-hover:bg-white/10">
                <Play className="h-3.5 w-3.5 fill-current" />
              </span>
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>

      {/* Carousel controls */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white/80 backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10 hover:text-white lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white/80 backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10 hover:text-white lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-14 left-5 flex items-center gap-5 sm:left-6 lg:bottom-20">
            <div className="flex items-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.image + i}
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-brass-500" : "w-4 bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
            {slides[index]?.caption && (
              <p className="hidden text-[0.6875rem] uppercase tracking-[0.18em] text-white/60 sm:block">
                {slides[index].caption}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
