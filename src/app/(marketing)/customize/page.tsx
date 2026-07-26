import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";
import { CustomizeForm } from "@/components/landing/customize-form";
import { PageHeader } from "@/components/landing/page-header";

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
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6">
      <PageHeader
        eyebrow="Customize your tour"
        title="Tell us about your trip"
        subtitle="We'll personally review this and match you with one of our trusted guides. You'll get a booking reference to track your request."
      />

      <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <CustomizeForm packages={packages} preselectedSlug={preselectedSlug} />
      </div>
    </div>
  );
}
