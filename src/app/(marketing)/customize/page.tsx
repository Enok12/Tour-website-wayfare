import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";
import { CustomizeForm } from "@/components/landing/customize-form";

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const [{ package: preselectedSlug }, res] = await Promise.all([
    searchParams,
    serverFetch<PackageDto[]>("/api/packages"),
  ]);

  const packages = res.success ? res.data : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="mb-3 font-display italic text-brass-600">Customize your tour</p>
      <h1 className="font-sans text-4xl font-bold tracking-tight text-pine-950 sm:text-5xl">
        Tell us about your trip
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        We&apos;ll personally review this and match you with one of our trusted guides. You&apos;ll
        get a booking reference to track your request.
      </p>

      <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <CustomizeForm packages={packages} preselectedSlug={preselectedSlug} />
      </div>
    </div>
  );
}
