import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/landing/page-header";
import { DestinationCard } from "@/components/landing/destination-card";
import { FinalCta } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";
import { destinationsFromPackages } from "@/lib/destinations";
import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";

export const metadata: Metadata = {
  title: "Destinations | Wayfare",
  description:
    "Every place our guides take travellers, drawn from the itineraries of our published tour packages.",
};

export default async function DestinationsPage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data : [];
  const destinations = destinationsFromPackages(packages);

  return (
    <div>
      <PageHeader
        eyebrow="Popular destinations"
        title="Where will you"
        accent="go next?"
        subtitle="Every place below is somewhere our guides actually take travellers — pulled straight from the itineraries of our published tours."
        image="/images/lk/dest-sigiriya.jpg"
        imageAlt="Sigiriya rock fortress rising above the plain"
      />

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        {destinations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pine-700/25 p-14 text-center text-ink-muted">
            <p>No destinations are published yet.</p>
            <Link
              href="/customize"
              className="mt-2 inline-block text-brass-600 underline underline-offset-4"
            >
              Tell us where you want to go
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {destinations.map((destination, i) => (
              <Reveal key={destination.name} delay={(i % 4) * 70}>
                <DestinationCard
                  destination={destination}
                  size={i % 5 === 0 ? "tall" : "default"}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <div className="pb-24 lg:pb-28">
        <FinalCta
          title="Somewhere else in mind?"
          body="We travel well beyond the places listed here. Tell us where you want to go and we will work out how."
          cta={{ href: "/customize", label: "Start planning" }}
        />
      </div>
    </div>
  );
}
