import Link from "next/link";
import { Photo, Scrim } from "@/components/landing/photo";
import { cn } from "@/lib/utils";

export interface Destination {
  name: string;
  region: string;
  image?: string | null;
  alt?: string;
  /** Package slug this place belongs to, so the card links somewhere real. */
  href: string;
  description?: string | null;
}

/**
 * A place, not a product. Deliberately smaller and quieter than PackageCard
 * so a wall of these reads as a mosaic rather than a second product grid.
 */
export function DestinationCard({
  destination,
  size = "default",
  className,
}: {
  destination: Destination;
  size?: "default" | "tall";
  className?: string;
}) {
  return (
    <Link
      href={destination.href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl",
        size === "tall" ? "aspect-[3/4]" : "aspect-[4/5]",
        className
      )}
    >
      <Photo
        src={destination.image}
        alt={destination.alt ?? destination.name}
        fallbackLabel={destination.name}
        className="h-full w-full"
        imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
      />
      <Scrim strength="medium" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-brass-400">
          {destination.region}
        </p>
        <h3 className="mt-1 font-display text-[1.375rem] font-semibold leading-tight text-white">
          {destination.name}
        </h3>
        <span className="mt-2 block h-px w-0 bg-brass-500 transition-all duration-500 group-hover:w-12" />
      </div>
    </Link>
  );
}
