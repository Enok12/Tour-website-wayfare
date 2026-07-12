import type { PackageDto } from "@/types";

/** A package's advertised "starting from" price: the sum of all its active locations. */
export function packageStartingPrice(pkg: PackageDto): number {
  return pkg.locations
    .filter((loc) => loc.isActive)
    .reduce((sum, loc) => sum + Number(loc.price), 0);
}
