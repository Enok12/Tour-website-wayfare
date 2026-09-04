import { CheckCircle2 } from "lucide-react";
import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";
import { CustomizeForm } from "@/components/landing/customize-form";
import { PageHeader } from "@/components/landing/page-header";

const reassurances = [
  "A person reads every request — usually within one business day.",
  "You get a booking reference straight away, no account needed.",
  "Nothing is charged here. Pricing is agreed with our team afterwards.",
];

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
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-6 lg:pb-28 lg:pt-40">
      <PageHeader
        eyebrow="Customize your tour"
        title="Tell us about"
        accent="your trip"
        subtitle="We will personally review this and match you with one of our trusted guides. You will get a booking reference to track your request."
      />

      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        {reassurances.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[0.8125rem] text-ink-muted">
            <CheckCircle2 className="mt-px h-4 w-4 shrink-0 text-pine-700" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-3xl bg-white p-6 shadow-card sm:p-10">
        <CustomizeForm packages={packages} preselectedSlug={preselectedSlug} />
      </div>
    </div>
  );
}
