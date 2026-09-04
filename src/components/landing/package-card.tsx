import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Photo } from "@/components/landing/photo";
import { packageStartingPrice } from "@/lib/package-pricing";
import { cn } from "@/lib/utils";
import type { PackageDto } from "@/types";

/**
 * The primary discovery card: photograph, duration badge, name, a one-line
 * taste of the itinerary, and the starting price with an arrow affordance.
 *
 * The price is the real `packageStartingPrice()` figure (the sum of the
 * package's active locations) formatted in the package's own currency -- not
 * a decorative number.
 */
export function PackageCard({
  pkg,
  className,
}: {
  pkg: PackageDto;
  className?: string;
}) {
  const activeLocations = pkg.locations.filter((loc) => loc.isActive);
  const itineraryTaste = activeLocations
    .slice(0, 3)
    .map((loc) => loc.name)
    .join(" · ");
  const price = packageStartingPrice(pkg);
  const nights = Math.max(pkg.durationDays - 1, 0);

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        className
      )}
    >
      <Photo
        src={pkg.coverImage}
        alt={pkg.name}
        fallbackLabel={pkg.name}
        className="aspect-[4/3] w-full"
        imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
      >
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-[0.6875rem] font-semibold tracking-wide text-pine-900 backdrop-blur-sm">
          <Clock className="h-3 w-3 text-brass-600" />
          {pkg.durationDays} {pkg.durationDays === 1 ? "Day" : "Days"}
          {nights > 0 && ` / ${nights} ${nights === 1 ? "Night" : "Nights"}`}
        </span>
      </Photo>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[1.375rem] font-semibold leading-tight text-pine-900 transition-colors duration-200 group-hover:text-pine-700">
          {pkg.name}
        </h3>

        {itineraryTaste && (
          <p className="mt-2 flex items-start gap-1.5 text-[0.75rem] font-medium leading-snug text-brass-600">
            <MapPin className="mt-px h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{itineraryTaste}</span>
          </p>
        )}

        <p className="mt-3 line-clamp-2 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
          {pkg.description}
        </p>

        <div className="mt-6 flex items-end justify-between border-t border-pine-900/8 pt-5">
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">From</p>
            <p className="font-display text-[1.5rem] font-semibold leading-none text-pine-900">
              {price > 0 ? formatPrice(price, pkg.currency) : "On request"}
            </p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine-900 text-linen transition-all duration-300 group-hover:bg-brass-500 group-hover:text-pine-950">
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
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
    // Guards against a non-ISO currency code being saved on a package.
    return `${currency} ${Math.round(value).toLocaleString("en-US")}`;
  }
}
