import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { PackageDto } from "@/types";

export function PackageCard({ pkg }: { pkg: PackageDto }) {
  const activeLocations = pkg.locations.filter((loc) => loc.isActive);
  const tasteOfLocations = activeLocations
    .slice(0, 3)
    .map((loc) => loc.name)
    .join(" · ");

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-pine-100">
        {pkg.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pkg.coverImage}
            alt={pkg.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-pine-700">
            <MapPin className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg text-pine-900">{pkg.name}</h3>
        {tasteOfLocations && (
          <p className="text-xs font-medium uppercase tracking-wide text-brass-600">
            {tasteOfLocations}
          </p>
        )}
        <p className="line-clamp-2 flex-1 text-sm text-ink-muted">{pkg.description}</p>
        <div className="mt-2 flex items-center justify-between border-t border-black/5 pt-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {pkg.durationDays} {pkg.durationDays === 1 ? "day" : "days"}
          </span>
          {activeLocations.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {activeLocations.length} {activeLocations.length === 1 ? "place" : "places"} to visit
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
