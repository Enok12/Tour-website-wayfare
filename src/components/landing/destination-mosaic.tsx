import Link from "next/link";
import { MapPin } from "lucide-react";
import type { PackageDto } from "@/types";

/**
 * Tiles are laid out in repeating gap-free blocks of 3 on a 4-column grid:
 * one 2x2 "large" tile plus two 2x1 "wide" tiles stacked beside it (4 + 2 + 2
 * = 8 cells = a full 4-col x 2-row band, no leftover cells). Blocks alternate
 * which side the large tile sits on for variety. Any 1 or 2 leftover tiles
 * at the end get a matching gap-free treatment (one full-width tile, or two
 * half-width tiles side by side) instead of being cycled through the same
 * shapes and risking an unfilled row.
 */
function tileClass(index: number, total: number): string {
  const remainder = total % 3;
  const fullBlockCount = Math.floor(total / 3);
  const lastBlockStart = fullBlockCount * 3;

  if (index >= lastBlockStart) {
    if (remainder === 1) return "sm:col-span-4 sm:row-span-1";
    if (remainder === 2) return "sm:col-span-2 sm:row-span-1";
  }

  const blockIndex = Math.floor(index / 3);
  const posInBlock = index % 3;
  const largeOnRight = blockIndex % 2 === 1;

  if (posInBlock === 0) {
    return largeOnRight ? "sm:col-start-3 sm:col-span-2 sm:row-span-2" : "sm:col-start-1 sm:col-span-2 sm:row-span-2";
  }
  return largeOnRight ? "sm:col-start-1 sm:col-span-2 sm:row-span-1" : "sm:col-start-3 sm:col-span-2 sm:row-span-1";
}

export function DestinationMosaic({ packages }: { packages: PackageDto[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:auto-rows-[9rem] sm:grid-cols-4 sm:grid-flow-dense lg:auto-rows-[10rem]">
      {packages.map((pkg, index) => (
        <Link
          key={pkg.id}
          href={`/packages/${pkg.slug}`}
          className={`group relative aspect-[4/3] overflow-hidden rounded-xl bg-pine-100 sm:aspect-auto ${tileClass(index, packages.length)}`}
        >
          {pkg.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pkg.coverImage}
              alt={pkg.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-pine-700">
              <MapPin className="h-8 w-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950/85 via-pine-950/10 to-transparent" />
          <div className="absolute bottom-0 left-0 flex items-center gap-2 p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass-500/90 text-white">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-lg text-white">{pkg.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
