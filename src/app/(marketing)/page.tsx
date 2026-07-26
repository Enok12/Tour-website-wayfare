import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/hero";
import { TrustBadges } from "@/components/landing/trust-badges";
import { JourneyDiagram } from "@/components/landing/journey-diagram";
import { DestinationMosaic } from "@/components/landing/destination-mosaic";
import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";

export default async function HomePage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data : [];
  const featured = packages.find((pkg) => pkg.coverImage) ?? packages[0];

  return (
    <>
      <Hero
        image={featured?.coverImage}
        eyebrow="Personally curated, not automated"
        title={
          <>
            Tell us your trip.
            <br />
            We&apos;ll find your guide.
          </>
        }
        subtitle="Every request is read and matched by a real person on our team to one of our trusted local guides -- picked for your trip, not the next one in a queue."
        primaryCta={{ href: "/customize", label: "Plan my trip" }}
        secondaryCta={{ href: "/packages", label: "Browse destinations" }}
      />

      <section className="border-b border-black/5 bg-white">
        <TrustBadges />
      </section>

      <section className="border-b border-black/5 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-10 font-display text-2xl text-pine-900 sm:text-3xl">How it works</h2>
          <JourneyDiagram />
        </div>
      </section>

      {packages.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 font-display italic text-brass-600">Where to next?</p>
              <h2 className="font-display text-2xl text-pine-900 sm:text-3xl">Destinations to fall for</h2>
            </div>
            <Link href="/packages" className="text-sm font-medium text-brass-600 hover:underline">
              View all
            </Link>
          </div>
          <DestinationMosaic packages={packages.slice(0, 6)} />
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
