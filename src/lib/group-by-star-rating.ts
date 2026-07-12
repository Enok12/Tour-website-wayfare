import type { PackageAccommodationDto } from "@/types";

/** Groups accommodations by star rating (ascending) so customers can browse tier by tier. */
export function groupByStarRating(accommodations: PackageAccommodationDto[]) {
  const groups = new Map<number, PackageAccommodationDto[]>();
  for (const acc of accommodations) {
    const list = groups.get(acc.starRating) ?? [];
    list.push(acc);
    groups.set(acc.starRating, list);
  }
  return [...groups.entries()].sort(([a], [b]) => a - b);
}
