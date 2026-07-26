"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero({
  image,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  image?: string | null;
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[34rem] items-end overflow-hidden bg-pine-900 sm:min-h-[38rem]">
      <div className="absolute inset-0">
        {image ? (
          <motion.img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: shouldReduceMotion ? 1 : 1.08 }}
            transition={{ duration: 20, ease: "easeOut" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-pine-700/40">
            <Compass className="h-32 w-32" strokeWidth={0.75} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950/95 via-pine-950/45 to-pine-950/10" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-32 sm:px-6 sm:pb-20">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-display text-sm italic text-linen backdrop-blur-sm">
          {eyebrow}
        </p>
        <h1 className="max-w-2xl font-sans text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-linen/90">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="brassSolid">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          {secondaryCta && (
            <Button
              asChild
              size="lg"
              variant="brassOutline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
