"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { TESTIMONIALS } from "@/content/site-content";
import { cn } from "@/lib/utils";

const ROTATE_MS = 9000;

/**
 * Traveller quotes. Avatars are typographic monograms rather than stock
 * portraits -- putting an invented face next to an invented name is a step
 * further than the copy needs to go.
 */
export function TestimonialCarousel({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;

  useEffect(() => {
    if (count < 2 || reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(id);
  }, [count, reduceMotion]);

  if (count === 0) return null;
  const active = TESTIMONIALS[index];

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <Quote className="h-8 w-8 shrink-0 fill-brass-500/25 text-brass-500/70" strokeWidth={1} />

      <blockquote
        key={index}
        className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink"
        style={{ animation: reduceMotion ? undefined : "wf-rise 500ms ease-out" }}
      >
        {active.quote}
      </blockquote>

      <div className="mt-7 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pine-900 font-display text-sm font-semibold tracking-wide text-brass-400">
            {active.initials}
          </span>
          <div>
            <p className="font-display text-[1.0625rem] font-semibold leading-tight text-pine-900">
              {active.name}
            </p>
            <p className="text-[0.75rem] text-ink-muted">{active.country}</p>
          </div>
        </div>

        {count > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIndex((i) => (i - 1 + count) % count)}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-pine-900/15 text-pine-700 transition-colors hover:border-brass-500 hover:text-brass-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % count)}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-pine-900/15 text-pine-700 transition-colors hover:border-brass-500 hover:text-brass-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center gap-1.5">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-brass-500" : "w-1.5 bg-pine-900/20 hover:bg-pine-900/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
