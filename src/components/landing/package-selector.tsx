"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Home, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { groupByStarRating } from "@/lib/group-by-star-rating";
import type { PackageDto } from "@/types";

export interface PackageSelection {
  packageId: string;
  accommodationId?: string;
  attributeIds?: string[];
}

function packagePrice(pkg: PackageDto, attributeIds: string[], accommodationId?: string) {
  const attributesTotal = pkg.attributes
    .filter((attr) => attributeIds.includes(attr.id))
    .reduce((sum, attr) => sum + Number(attr.price), 0);
  const accommodation = pkg.accommodations.find((a) => a.id === accommodationId);
  return Number(pkg.price) + attributesTotal + Number(accommodation?.price ?? 0);
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-brass-500 text-brass-500" />
      ))}
    </span>
  );
}

export function PackageSelector({
  packages,
  value,
  onChange,
}: {
  packages: PackageDto[];
  value: PackageSelection[];
  onChange: (value: PackageSelection[]) => void;
}) {
  const selectionMap = useMemo(() => new Map(value.map((s) => [s.packageId, s])), [value]);

  const grandTotal = useMemo(
    () =>
      value.reduce((sum, selection) => {
        const pkg = packages.find((p) => p.id === selection.packageId);
        return pkg ? sum + packagePrice(pkg, selection.attributeIds ?? [], selection.accommodationId) : sum;
      }, 0),
    [packages, value]
  );

  function togglePackage(packageId: string, checked: boolean) {
    if (checked) {
      onChange([...value, { packageId, attributeIds: [], accommodationId: undefined }]);
    } else {
      onChange(value.filter((s) => s.packageId !== packageId));
    }
  }

  function toggleAttribute(packageId: string, attributeId: string, checked: boolean) {
    onChange(
      value.map((s) =>
        s.packageId !== packageId
          ? s
          : {
              ...s,
              attributeIds: checked
                ? [...(s.attributeIds ?? []), attributeId]
                : (s.attributeIds ?? []).filter((id) => id !== attributeId),
            }
      )
    );
  }

  function selectAccommodation(packageId: string, accommodationId: string) {
    onChange(value.map((s) => (s.packageId !== packageId ? s : { ...s, accommodationId })));
  }

  return (
    <div className="space-y-3">
      {packages.map((pkg) => {
        const selection = selectionMap.get(pkg.id);
        const isSelected = Boolean(selection);
        const activeAttributes = pkg.attributes.filter((a) => a.isActive);
        const accommodationGroups = groupByStarRating(pkg.accommodations.filter((a) => a.isActive));

        return (
          <div key={pkg.id} className="rounded-lg border border-black/10 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`pkg-${pkg.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => togglePackage(pkg.id, checked === true)}
                className="mt-0.5"
              />
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-pine-100">
                {pkg.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pkg.coverImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-pine-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor={`pkg-${pkg.id}`} className="cursor-pointer text-base text-pine-900">
                  {pkg.name}
                </Label>
                <p className="text-sm text-ink-muted">
                  {pkg.durationDays} {pkg.durationDays === 1 ? "day" : "days"} · from {pkg.currency}{" "}
                  {Number(pkg.price).toLocaleString()}
                </p>
              </div>
              {isSelected && (
                <motion.p
                  key={packagePrice(pkg, selection!.attributeIds ?? [], selection!.accommodationId)}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-display text-lg text-brass-600"
                >
                  {pkg.currency} {packagePrice(pkg, selection!.attributeIds ?? [], selection!.accommodationId).toLocaleString()}
                </motion.p>
              )}
            </div>

            {isSelected && accommodationGroups.length > 0 && (
              <div className="mt-3 space-y-4 border-t border-black/5 pl-7 pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Choose your accommodation
                </p>
                {accommodationGroups.map(([starRating, accs]) => (
                  <div key={starRating} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-pine-900">
                      <StarRow count={starRating} />
                      <span>{starRating} Star</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {accs.map((acc) => {
                        const isChosen = selection!.accommodationId === acc.id;
                        return (
                          <motion.button
                            key={acc.id}
                            type="button"
                            onClick={() => selectAccommodation(pkg.id, acc.id)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={cn(
                              "overflow-hidden rounded-lg border-2 text-left",
                              isChosen ? "border-pine-900" : "border-transparent ring-1 ring-black/10 hover:ring-black/20"
                            )}
                          >
                            <div className="relative aspect-[4/3] w-full bg-pine-100">
                              {acc.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={acc.image} alt={acc.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-pine-700">
                                  <Home className="h-6 w-6" />
                                </div>
                              )}
                              <AnimatePresence>
                                {isChosen && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute inset-0 flex items-center justify-center bg-pine-900/30"
                                  >
                                    <motion.span
                                      initial={{ scale: 0.6, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                      className="rounded-full bg-pine-900 px-2 py-0.5 text-xs font-medium text-white"
                                    >
                                      Selected
                                    </motion.span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="p-2">
                              <p className="line-clamp-1 text-sm font-medium text-pine-900">{acc.name}</p>
                              <p className="text-xs text-ink-muted">
                                +{pkg.currency} {Number(acc.price).toLocaleString()}
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {!selection!.accommodationId && (
                  <p className="text-xs text-danger">Select an accommodation for this package.</p>
                )}
              </div>
            )}

            {isSelected && activeAttributes.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-black/5 pl-7 pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Add to this package
                </p>
                {activeAttributes.map((attr) => (
                  <div key={attr.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`attr-${attr.id}`}
                        checked={(selection!.attributeIds ?? []).includes(attr.id)}
                        onCheckedChange={(checked) => toggleAttribute(pkg.id, attr.id, checked === true)}
                      />
                      <Label htmlFor={`attr-${attr.id}`} className="cursor-pointer font-normal text-ink-muted">
                        {attr.name}
                      </Label>
                    </div>
                    <span className="text-sm text-ink-muted">
                      +{pkg.currency} {Number(attr.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {value.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-pine-50 px-4 py-3">
          <span className="font-medium text-pine-900">Estimated total</span>
          <motion.span
            key={grandTotal}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="font-display text-xl text-pine-900"
          >
            ${grandTotal.toLocaleString()}
          </motion.span>
        </div>
      )}
    </div>
  );
}
