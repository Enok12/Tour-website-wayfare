import { destinationImageFor } from "@/content/site-content";
import type { Destination } from "@/components/landing/destination-card";
import type { PackageDto } from "@/types";

/**
 * Destinations are not their own table -- they are the active locations
 * attached to published packages. This flattens those into unique places,
 * attaching a photograph from the curated map where one exists and falling
 * back to the parent package's cover image, so nothing here is invented.
 *
 * Ordering follows the packages' own `sortOrder`, so whatever an admin puts
 * first in a package is what surfaces first on the site.
 */
export function destinationsFromPackages(packages: PackageDto[]): Destination[] {
  const seen = new Map<string, Destination>();

  for (const pkg of packages) {
    if (!pkg.isActive) continue;

    const locations = pkg.locations
      .filter((loc) => loc.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    for (const loc of locations) {
      const key = loc.name.trim().toLowerCase();
      if (seen.has(key)) continue;

      const curated = destinationImageFor(loc.name);
      seen.set(key, {
        name: loc.name,
        region: curated?.region ?? pkg.name,
        image: curated?.image ?? pkg.coverImage,
        alt: curated?.alt ?? loc.name,
        href: `/packages/${pkg.slug}`,
        description: loc.description,
      });
    }
  }

  return [...seen.values()];
}
