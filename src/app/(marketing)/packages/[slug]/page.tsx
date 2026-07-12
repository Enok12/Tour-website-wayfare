import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, Home, Star, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-pine-100">
        {pkg.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pkg.coverImage} alt={pkg.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-pine-700">
            <Clock className="h-12 w-12" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-pine-950 sm:text-4xl">{pkg.name}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-sm text-ink-muted">
            <Clock className="h-4 w-4" /> {pkg.durationDays} {pkg.durationDays === 1 ? "day" : "days"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl text-brass-600">
            {pkg.currency} {packageStartingPrice(pkg).toLocaleString()}
          </p>
          <p className="text-xs text-ink-muted">starting from, per person</p>
        </div>
      </div>

      <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink-muted">
        {pkg.description}
      </p>

      {pkg.locations.filter((l) => l.isActive).length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-display text-lg text-pine-900">Places you&apos;ll visit</h2>
          <p className="mb-3 text-sm text-ink-muted">
            Included by default when you request this package — deselect any you&apos;d rather skip.
          </p>
          <ul className="space-y-2">
            {pkg.locations
              .filter((l) => l.isActive)
              .map((loc) => (
                <li key={loc.id} className="flex items-start justify-between gap-3 text-sm text-ink-muted">
                  <span>{loc.name}</span>
                  <span className="shrink-0 font-medium text-pine-900">
                    {pkg.currency} {Number(loc.price).toLocaleString()}
                  </span>
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

      {pkg.attributes.filter((a) => a.isActive).length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-display text-lg text-pine-900">Customize this trip</h2>
          <p className="mb-3 text-sm text-ink-muted">
            Add any of these when you request this package — pricing updates as you pick.
          </p>
          <ul className="space-y-2">
            {pkg.attributes
              .filter((a) => a.isActive)
              .map((attr) => (
                <li key={attr.id} className="flex items-start justify-between gap-3 text-sm text-ink-muted">
                  <span>{attr.name}</span>
                  <span className="shrink-0 font-medium text-pine-900">
                    +{pkg.currency} {Number(attr.price).toLocaleString()}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {pkg.accommodations.filter((a) => a.isActive).length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-display text-lg text-pine-900">Accommodation options</h2>
          <p className="mb-3 text-sm text-ink-muted">
            Pick where you&apos;ll stay when you request this package.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {groupByStarRating(pkg.accommodations.filter((a) => a.isActive))
              .flatMap(([, accs]) => accs)
              .map((acc) => (
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
                    <p className="text-xs text-ink-muted">
                      +{pkg.currency} {Number(acc.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-pine-700/20 bg-pine-50 p-6 text-center">
        <h3 className="font-display text-lg text-pine-900">Ready to book this trip?</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Submit your details and we&apos;ll personally match you with a guide for this package.
        </p>
        <Button asChild variant="brand" className="mt-4">
          <Link href={`/customize?package=${pkg.slug}`}>Request this package</Link>
        </Button>
      </div>
    </div>
  );
}
