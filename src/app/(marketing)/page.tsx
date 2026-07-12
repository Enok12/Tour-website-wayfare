import Link from "next/link";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JourneyDiagram } from "@/components/landing/journey-diagram";
import { PackageCard } from "@/components/landing/package-card";
import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";

export default async function HomePage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data.slice(0, 3) : [];

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-pine-700/30 bg-pine-50 px-3 py-1 font-display text-sm italic text-pine-800">
              Personally curated, not automated
            </p>
            <h1 className="font-sans text-4xl font-bold leading-[1.05] tracking-tight text-pine-950 sm:text-5xl lg:text-6xl">
              Tell us your trip.
              <br />
              We&apos;ll find your guide.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              Every request is read and matched by a real person on our team to one of our
              trusted local guides -- picked for your trip, not the next one in a queue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="brand">
                <Link href="/customize">
                  Plan my trip <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/packages">Browse packages</Link>
              </Button>
            </div>
            <div className="mt-10 flex gap-8 text-sm text-ink-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brass-600" />
                Vetted, trusted guides
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brass-600" />
                Matched by a person, not an app
              </div>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-md justify-self-center overflow-hidden rounded-2xl border border-pine-900/10 bg-pine-900 lg:justify-self-end">
            <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
              <rect width="400" height="400" fill="var(--pine-900)" />
              <path
                d="M40 320 C 120 260, 140 180, 90 120 S 200 40, 260 90 S 340 200, 300 260"
                fill="none"
                stroke="var(--brass-400)"
                strokeWidth="2.5"
                strokeDasharray="1 12"
                strokeLinecap="round"
              />
              <circle cx="40" cy="320" r="7" fill="var(--brass-500)" />
              <circle cx="90" cy="120" r="5" fill="var(--pine-100)" />
              <circle cx="260" cy="90" r="5" fill="var(--pine-100)" />
              <circle cx="300" cy="260" r="7" fill="var(--brass-500)" />
              <text x="55" y="345" fill="var(--pine-100)" fontSize="13" fontFamily="var(--font-display)">
                Your request
              </text>
              <text x="240" y="300" fill="var(--pine-100)" fontSize="13" fontFamily="var(--font-display)">
                Your guide
              </text>
            </svg>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-10 font-display text-2xl text-pine-900 sm:text-3xl">How it works</h2>
          <JourneyDiagram />
        </div>
      </section>

      {packages.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-pine-900 sm:text-3xl">Featured packages</h2>
            <Link href="/packages" className="text-sm font-medium text-brass-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-pine-900 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl">Not sure exactly what you want yet?</h2>
          <p className="mt-3 text-pine-100/80">
            Tell us as much or as little as you know -- we&apos;ll shape the rest around you.
          </p>
          <Button asChild size="lg" variant="brassOutline" className="mt-6 border-brass-400 text-brass-400 hover:bg-white/5">
            <Link href="/customize">Start customizing</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
