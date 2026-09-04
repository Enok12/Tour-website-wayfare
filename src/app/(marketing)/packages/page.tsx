import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/landing/page-header";
import { PackageCard } from "@/components/landing/package-card";
import { TrustBenefits } from "@/components/landing/trust-benefits";
import { FinalCta } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";
import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";

export default async function PackagesPage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data : [];

  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 pt-36 sm:px-6 lg:pt-40">
        <PageHeader
          eyebrow="Featured packages"
          title="Handpicked tours"
          accent="just for you"
          subtitle="Ready-made routes, still personally guided. Pick one as a starting point and we will adjust anything you like — or start from a blank page instead."
        >
          <Link
            href="/customize"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-brass-600 transition-colors hover:text-brass-700"
          >
            Build your own trip instead
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </PageHeader>

        {packages.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-pine-700/25 p-14 text-center text-ink-muted">
            No packages are published yet — check back soon, or tell us what you have in mind.
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={(i % 3) * 80}>
                <PackageCard pkg={pkg} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <div className="mt-24 lg:mt-28">
        <TrustBenefits />
      </div>

      <div className="mt-16 pb-24 lg:pb-28">
        <FinalCta
          title="None of these quite right?"
          body="Every package here started as somebody's custom request. Tell us yours and we will build it."
          cta={{ href: "/customize", label: "Customize your tour" }}
        />
      </div>
    </div>
  );
}
