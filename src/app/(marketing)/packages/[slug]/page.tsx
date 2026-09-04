import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, Home, MapPin, Star, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Photo, Scrim } from "@/components/landing/photo";
import { FinalCta } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";
import { serverFetch } from "@/lib/server-fetch";
import { groupByStarRating } from "@/lib/group-by-star-rating";
import { packageStartingPrice } from "@/lib/package-pricing";
import type { PackageDto } from "@/types";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await serverFetch<PackageDto>(`/api/packages/slug/${slug}`);

  if (!res.success) notFound();
  const pkg = res.data;

  const activeLocations = pkg.locations.filter((l) => l.isActive);
  const activeAttributes = pkg.attributes.filter((a) => a.isActive);
  const activeAccommodations = groupByStarRating(
    pkg.accommodations.filter((a) => a.isActive)
  ).flatMap(([, accs]) => accs);

  const price = packageStartingPrice(pkg);
  const nights = Math.max(pkg.durationDays - 1, 0);

  return (
    <div>
      {/* ------------------------------------------------------------ hero */}
      <header className="relative flex min-h-[28rem] items-end overflow-hidden bg-pine-900 sm:min-h-[34rem]">
        <Photo
          src={pkg.coverImage}
          alt={pkg.name}
          fallbackLabel={pkg.name}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <Scrim strength="strong" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-pine-950/75 via-pine-950/25 to-transparent"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-40 sm:px-6">
          <p className="mb-4 inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-brass-400">
            <span className="h-px w-8 bg-brass-500" />
            Tour package
          </p>
          <h1 className="max-w-3xl font-display text-[2.5rem] font-semibold leading-[1.05] text-white sm:text-[3.5rem]">
            {pkg.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-linen/85">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-brass-400" />
              {pkg.durationDays} {pkg.durationDays === 1 ? "day" : "days"}
              {nights > 0 && ` / ${nights} ${nights === 1 ? "night" : "nights"}`}
            </span>
            {activeLocations.length > 0 && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brass-400" />
                {activeLocations.length}{" "}
                {activeLocations.length === 1 ? "place to visit" : "places to visit"}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------ body + rail */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="min-w-0">
            <p className="whitespace-pre-line font-display text-[1.375rem] leading-relaxed text-pine-900">
              {pkg.description}
            </p>

            {pkg.galleryImages.length > 0 && (
              <Reveal className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {pkg.galleryImages.map((image) => (
                  <Photo
                    key={image}
                    src={image}
                    alt={pkg.name}
                    className="aspect-square rounded-xl"
                    imgClassName="transition-transform duration-700 hover:scale-105"
                  />
                ))}
              </Reveal>
            )}

            {activeLocations.length > 0 && (
              <Section label="The route" title="Places you'll visit">
                <p className="mb-8 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
                  What this trip is built around — all included by default when you plan it
                  with us.
                </p>
                <ol className="space-y-7">
                  {activeLocations.map((loc, i) => (
                    <li key={loc.id} className="flex gap-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brass-500/40 bg-brass-100/50 font-display text-sm font-semibold text-brass-700">
                        {i + 1}
                      </span>
                      <div className="min-w-0 border-b border-pine-900/8 pb-6">
                        <h3 className="font-display text-[1.25rem] font-semibold leading-tight text-pine-900">
                          {loc.name}
                        </h3>
                        {loc.description && (
                          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                            {loc.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            <Section label="The detail" title="What's included">
              <div className="grid gap-10 sm:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-pine-700">
                    Included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.includedServices.length === 0 && (
                      <li className="text-sm text-ink-muted">Details provided on inquiry.</li>
                    )}
                    {pkg.includedServices.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-ink-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-pine-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                    Not included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.excludedServices.length === 0 && (
                      <li className="text-sm text-ink-muted">Nothing notable excluded.</li>
                    )}
                    {pkg.excludedServices.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-ink-muted">
                        <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {activeAttributes.length > 0 && (
              <Section label="Make it yours" title="Optional additions">
                <p className="mb-7 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
                  Extras you can fold in when you plan this trip with us.
                </p>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {activeAttributes.map((attr) => (
                    <li
                      key={attr.id}
                      className="rounded-xl border border-pine-900/10 bg-white/60 p-5"
                    >
                      <p className="font-display text-[1.0625rem] font-semibold text-pine-900">
                        {attr.name}
                      </p>
                      {attr.description && (
                        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-muted">
                          {attr.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {activeAccommodations.length > 0 && (
              <Section label="Where you'll stay" title="Accommodation options">
                <p className="mb-7 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
                  A taste of where you could stay — you will choose one when you plan the trip.
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {activeAccommodations.map((acc) => (
                    <div key={acc.id} className="group overflow-hidden rounded-xl bg-white shadow-card">
                      <Photo
                        src={acc.image}
                        alt={acc.name}
                        fallbackLabel={acc.name}
                        className="aspect-[4/3] w-full"
                        imgClassName="transition-transform duration-700 group-hover:scale-105"
                      >
                        {!acc.image && (
                          <Home
                            className="absolute inset-0 m-auto h-6 w-6 text-brass-400/70"
                            aria-hidden="true"
                          />
                        )}
                        <span className="absolute left-2.5 top-2.5 flex items-center gap-0.5 rounded-full bg-pine-950/65 px-2 py-1 backdrop-blur-sm">
                          {Array.from({ length: acc.starRating }).map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 fill-brass-400 text-brass-400" />
                          ))}
                        </span>
                      </Photo>
                      <p className="line-clamp-1 px-3 py-2.5 text-[0.8125rem] font-medium text-pine-900">
                        {acc.name}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Sticky booking rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-brass-500/20 bg-white p-7 shadow-card">
              <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle">
                Starting from
              </p>
              <p className="mt-1 font-display text-[2.5rem] font-semibold leading-none text-pine-900">
                {price > 0 ? formatPrice(price, pkg.currency) : "On request"}
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                Final pricing depends on the places, extras and accommodation you choose — you
                will see a running total as you build it.
              </p>

              <Button asChild variant="brand" size="lg" className="mt-6 w-full">
                <Link href={`/customize?package=${pkg.slug}`}>
                  Plan this trip
                  <ArrowRight />
                </Link>
              </Button>

              <dl className="mt-7 space-y-3 border-t border-pine-900/8 pt-6 text-[0.8125rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Duration</dt>
                  <dd className="font-medium text-pine-900">{pkg.durationDays} days</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Places</dt>
                  <dd className="font-medium text-pine-900">{activeLocations.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Booking fee</dt>
                  <dd className="font-medium text-pine-900">None</dd>
                </div>
              </dl>

              <p className="mt-6 border-t border-pine-900/8 pt-5 text-[0.75rem] leading-relaxed text-ink-subtle">
                A person on our team reads every request and picks your guide by hand.
              </p>
            </div>

            <Link
              href="/packages"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-pine-700 transition-colors hover:text-brass-600"
            >
              All tour packages
            </Link>
          </aside>
        </div>
      </div>

      <div className="pb-24 lg:pb-28">
        <FinalCta
          title={`Ready for ${pkg.name}?`}
          body="Tell us your dates and preferences and we will personally match you with a guide."
          cta={{ href: `/customize?package=${pkg.slug}`, label: "Plan this trip with us" }}
        />
      </div>
    </div>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="mt-16 border-t border-pine-900/8 pt-12">
      <p className="section-label mb-3">{label}</p>
      <h2 className="mb-7 font-display text-[1.875rem] font-semibold leading-tight text-pine-900">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

function formatPrice(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString("en-US")}`;
  }
}
