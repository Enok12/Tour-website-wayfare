import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, Home, MapPin, Star, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-fetch";
import { groupByStarRating } from "@/lib/group-by-star-rating";
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
  const activeAccommodations = groupByStarRating(pkg.accommodations.filter((a) => a.isActive)).flatMap(
    ([, accs]) => accs
  );

  return (
    <div>
      <div className="relative flex min-h-[26rem] items-end overflow-hidden bg-pine-900 sm:min-h-[30rem]">
        {pkg.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pkg.coverImage}
            alt={pkg.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-pine-700/40">
            <MapPin className="h-24 w-24" strokeWidth={0.75} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950/90 via-pine-950/30 to-pine-950/10" />
        <div className="relative mx-auto w-full max-w-4xl px-4 pb-10 sm:px-6">
          <h1 className="font-display text-3xl text-white sm:text-4xl">{pkg.name}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-sm text-linen/90">
            <Clock className="h-4 w-4" /> {pkg.durationDays} {pkg.durationDays === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="whitespace-pre-line text-base leading-relaxed text-ink-muted">
          {pkg.description}
        </p>

        {pkg.galleryImages.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {pkg.galleryImages.map((image) => (
              <div key={image} className="aspect-square overflow-hidden rounded-lg bg-pine-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={pkg.name} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {activeLocations.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 font-display text-lg text-pine-900">Places you&apos;ll visit</h2>
            <p className="mb-4 text-sm text-ink-muted">
              What this trip is built around — all included by default when you plan it with us.
            </p>
            <ul className="space-y-4">
              {activeLocations.map((loc) => (
                <li key={loc.id} className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
                  <div>
                    <p className="font-medium text-pine-900">{loc.name}</p>
                    {loc.description && (
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{loc.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-lg text-pine-900">Included</h2>
            <ul className="space-y-2">
              {pkg.includedServices.length === 0 && (
                <li className="text-sm text-ink-muted">Details provided upon inquiry.</li>
              )}
              {pkg.includedServices.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-display text-lg text-pine-900">Not included</h2>
            <ul className="space-y-2">
              {pkg.excludedServices.length === 0 && (
                <li className="text-sm text-ink-muted">Nothing notable excluded.</li>
              )}
              {pkg.excludedServices.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                  <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-700" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {activeAttributes.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 font-display text-lg text-pine-900">Customize this trip</h2>
            <p className="mb-3 text-sm text-ink-muted">
              Optional extras you can add when you plan this trip with us.
            </p>
            <ul className="space-y-2">
              {activeAttributes.map((attr) => (
                <li key={attr.id} className="text-sm text-ink-muted">
                  <span className="font-medium text-pine-900">{attr.name}</span>
                  {attr.description && <span> — {attr.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeAccommodations.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 font-display text-lg text-pine-900">Accommodation options</h2>
            <p className="mb-3 text-sm text-ink-muted">
              A taste of where you could stay — you&apos;ll choose one when you plan this trip.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {activeAccommodations.map((acc) => (
                <div key={acc.id} className="overflow-hidden rounded-lg border border-black/10">
                  <div className="relative aspect-[4/3] w-full bg-pine-100">
                    {acc.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={acc.image} alt={acc.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-pine-700">
                        <Home className="h-6 w-6" />
                      </div>
                    )}
                    <div className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5">
                      {Array.from({ length: acc.starRating }).map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-white text-white" />
                      ))}
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-1 text-sm font-medium text-pine-900">{acc.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 rounded-xl border border-pine-700/20 bg-pine-50 p-6 text-center">
          <h3 className="font-display text-lg text-pine-900">Ready to plan this trip?</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Tell us your dates and preferences and we&apos;ll personally match you with a guide.
          </p>
          <Button asChild variant="brand" className="mt-4">
            <Link href={`/customize?package=${pkg.slug}`}>Plan this trip with us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
