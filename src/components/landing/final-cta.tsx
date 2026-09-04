import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/landing/photo";
import { Reveal } from "@/components/landing/reveal";

/** The closing banner: coastal photograph, pine wash, one clear action. */
export function FinalCta({
  image = "/images/lk/dest-unawatuna.jpg",
  alt = "A quiet cove on the Sri Lankan south coast",
  title = "Ready to start your journey?",
  body = "Tell us as much or as little as you know. We will shape the rest around you.",
  cta = { href: "/customize", label: "Plan Your Trip Today" },
}: {
  image?: string;
  alt?: string;
  title?: string;
  body?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6">
      <Reveal className="relative overflow-hidden rounded-3xl">
        <Photo
          src={image}
          alt={alt}
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="absolute inset-0 h-full w-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-pine-950/92 via-pine-950/70 to-pine-900/45"
        />

        <div className="relative flex flex-col gap-8 px-8 py-14 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div className="max-w-xl">
            <h2 className="font-display text-[2rem] font-semibold leading-tight text-linen sm:text-[2.6rem]">
              {title}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-linen/75">{body}</p>
          </div>

          <Button asChild size="pill" variant="brassSolid" className="group h-13 shrink-0 px-8 text-[0.9rem]">
            <Link href={cta.href}>
              {cta.label}
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
