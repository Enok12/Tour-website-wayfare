import Link from "next/link";
import { PageHeader } from "@/components/landing/page-header";
import { PackageCard } from "@/components/landing/package-card";
import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";

export default async function PackagesPage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data : [];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6">
      <PageHeader
        eyebrow="Tour packages"
        title="Ready-made trips, still personally guided"
        subtitle="Prefer a starting point? Pick a destination below and see what's included, or build your own from scratch."
      />
      <Link href="/customize" className="mt-2 inline-block text-brass-600 underline underline-offset-2">
        Build your own trip instead
      </Link>

      {packages.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-pine-700/30 p-12 text-center text-ink-muted">
          No packages are published yet -- check back soon, or tell us what you have in mind.
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
