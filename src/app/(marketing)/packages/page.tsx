import { PackageCard } from "@/components/landing/package-card";
import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";

export default async function PackagesPage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="mb-3 font-display italic text-brass-600">Tour packages</p>
      <h1 className="max-w-2xl font-sans text-4xl font-bold tracking-tight text-pine-950 sm:text-5xl">
        Ready-made trips, still personally guided
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        Prefer a starting point? Pick a package below, or{" "}
        <a href="/customize" className="text-brass-600 underline underline-offset-2">
          build your own
        </a>
        .
      </p>

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
