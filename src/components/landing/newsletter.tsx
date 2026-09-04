"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { BRAND } from "@/content/site-content";
import { cn } from "@/lib/utils";

/**
 * There is no subscriber list or mailing endpoint in this codebase, so rather
 * than pretending to store the address, submitting composes a pre-filled
 * email to the team. It genuinely works, and nobody is told they were added
 * to a list that does not exist. Swap `handleSubmit` for a real POST once a
 * subscription endpoint exists.
 */
export function Newsletter({ variant = "band" }: { variant?: "band" | "compact" }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    const subject = encodeURIComponent("Travel inspiration list");
    const body = encodeURIComponent(
      `Please add ${value} to the Wayfare travel inspiration list.`
    );
    window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`;

    setSent(true);
    toast.success("Opening your email app to confirm your subscription.");
    setEmail("");
  }

  const compact = variant === "compact";

  const form = (
    <form onSubmit={handleSubmit} className={cn("relative", compact ? "max-w-xs" : "max-w-md")}>
      <label htmlFor={`newsletter-${variant}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-${variant}`}
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setSent(false);
        }}
        placeholder="Your email address"
        className={cn(
          "w-full rounded-full border py-3.5 pl-5 pr-14 text-sm transition-colors placeholder:text-ink-subtle focus-visible:outline-none",
          compact
            ? "border-white/20 bg-white/5 text-linen placeholder:text-linen/40 focus-visible:border-brass-400"
            : "border-pine-900/15 bg-white text-ink focus-visible:border-brass-500"
        )}
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className={cn(
          "absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-colors",
          sent
            ? "bg-pine-700 text-linen"
            : "bg-pine-900 text-linen hover:bg-brass-500 hover:text-pine-950"
        )}
      >
        {sent ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );

  if (compact) {
    return (
      <div>
        <h3 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-brass-400">
          Newsletter
        </h3>
        <p className="mb-4 max-w-xs text-sm leading-relaxed text-linen/70">
          Travel tips, seasonal advice and the occasional quiet corner of the island.
        </p>
        {form}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-brass-500/25 bg-linen-dark/60">
        <div className="grid items-center gap-10 px-8 py-12 sm:px-12 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="section-label mb-3">Stay inspired</p>
            <h2 className="font-display text-[2rem] font-semibold leading-tight text-pine-900 sm:text-[2.5rem]">
              Sri Lanka, once a month{" "}
              <span className="font-script text-[1.15em] font-normal text-brass-600">
                in your inbox
              </span>
            </h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-muted">
              Seasonal advice on where the weather is good, quiet places worth the detour, and
              the occasional offer. No more than once a month, and nothing passed on to anyone.
            </p>
          </div>

          <div className="lg:justify-self-end lg:text-right">
            <div className="lg:flex lg:justify-end">{form}</div>
            <p className="mt-3 text-[0.75rem] text-ink-subtle">
              Unsubscribe any time. We never share your address.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
