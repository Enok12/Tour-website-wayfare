import { ShieldCheck, Compass, HeartHandshake, MapPin } from "lucide-react";
import { PageHeader } from "@/components/landing/page-header";
import { serverFetch } from "@/lib/server-fetch";
import type { PackageDto } from "@/types";

const values = [
  {
    icon: Compass,
    title: "Every trip, read by a person",
    body: "No request goes through an algorithm. Each one is read, considered, and matched by our team.",
  },
  {
    icon: ShieldCheck,
    title: "Guides we already trust",
    body: "Every guide we work with has been personally vetted -- we only assign people we'd send our own family to.",
  },
  {
    icon: HeartHandshake,
    title: "Matched to fit, not to queue",
    body: "We pick the guide who's the best fit for your trip and your dates -- not whoever happens to be next.",
  },
];

export default async function AboutPage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data : [];
  const bandImage = packages.find((pkg) => pkg.coverImage)?.coverImage;

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6">
        <PageHeader
          eyebrow="About us"
          title="We started this because trip planning shouldn't feel automated."
          subtitle="Wayfare began as one person personally organizing tours for friends, then friends of friends. As requests grew past what any one person could run alone, we built a small team of trusted guides -- but kept the part that mattered: every request is still read and matched by hand, never handed off to a matching algorithm."
        />
      </div>

      <div className="relative aspect-[21/9] w-full overflow-hidden bg-pine-900">
        {bandImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bandImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-pine-700/40">
            <MapPin className="h-16 w-16" strokeWidth={0.75} />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title}>
              <value.icon className="h-6 w-6 text-brass-600" />
              <h3 className="mt-3 font-display text-lg text-pine-900">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{value.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
