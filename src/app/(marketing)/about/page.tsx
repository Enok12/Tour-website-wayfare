import { ShieldCheck, Compass, HeartHandshake } from "lucide-react";
import { PageHeader } from "@/components/landing/page-header";
import { JourneyDiagram } from "@/components/landing/journey-diagram";
import { StatisticsSection } from "@/components/landing/statistics-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Photo } from "@/components/landing/photo";
import { Reveal } from "@/components/landing/reveal";
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
    body: "Every guide we work with has been personally vetted — we only assign people we would send our own family to.",
  },
  {
    icon: HeartHandshake,
    title: "Matched to fit, not to queue",
    body: "We pick the guide who is the best fit for your trip and your dates, not whoever happens to be next.",
  },
];

export default async function AboutPage() {
  const res = await serverFetch<PackageDto[]>("/api/packages");
  const packages = res.success ? res.data : [];
  const bandImage = packages.find((pkg) => pkg.coverImage)?.coverImage;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 pt-36 sm:px-6 lg:pt-40">
        <PageHeader
          eyebrow="About us"
          title="Trip planning shouldn't feel"
          accent="automated."
          subtitle="Wayfare began as one person organising tours for friends, then friends of friends. As requests outgrew what any one person could run alone we built a small team of trusted guides — but kept the part that mattered: every request is still read and matched by hand."
        />
      </div>

      <Reveal className="mx-auto mt-16 max-w-7xl px-5 sm:px-6">
        <Photo
          src={bandImage ?? "/images/lk/hero-tea-country.jpg"}
          alt="Tea plantations in the Sri Lankan hill country"
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="aspect-[21/9] w-full rounded-3xl"
        />
      </Reveal>

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24">
        <div className="grid gap-10 sm:grid-cols-3">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 90}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pine-50 text-pine-700">
                <value.icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-display text-[1.375rem] font-semibold leading-tight text-pine-900">
                {value.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">{value.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 border-t border-pine-900/8 pt-16">
          <p className="section-label mb-3">How it works</p>
          <h2 className="mb-12 max-w-xl font-display text-[2rem] font-semibold leading-tight text-pine-900 sm:text-[2.5rem]">
            Four steps, one{" "}
            <span className="font-script text-[1.15em] font-normal text-brass-500">real person</span>
          </h2>
          <JourneyDiagram />
        </div>
      </div>

      <StatisticsSection />

      <div className="mt-6 pb-24 lg:pb-28">
        <FinalCta />
      </div>
    </div>
  );
}
