"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Circle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTrackBooking } from "@/hooks/use-tracking";
import { PageHeader } from "@/components/landing/page-header";
import { cn } from "@/lib/utils";
import type { TourRequestStatus } from "@prisma/client";

const steps: { key: TourRequestStatus; label: string }[] = [
  { key: "PENDING", label: "Received" },
  { key: "ASSIGNED", label: "Guide assigned" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "COMPLETED", label: "Completed" },
];

function stepIndex(status: TourRequestStatus) {
  if (status === "CANCELLED") return -1;
  return steps.findIndex((s) => s.key === status);
}

function TrackPageInner() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState(searchParams.get("ref") ?? "");
  const track = useTrackBooking();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) track.mutate(ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (reference.trim()) track.mutate(reference);
  }

  const result = track.data?.data;
  const currentStep = result ? stepIndex(result.status) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32 sm:px-6">
      <PageHeader
        eyebrow="Track your booking"
        title="Where's my trip at?"
        subtitle="Enter the booking reference you received after submitting your request."
      />

      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <Input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="TRK-2026-XXXX"
          className="font-display uppercase tracking-wide"
        />
        <Button type="submit" variant="brand" disabled={track.isPending}>
          <Search className="h-4 w-4" /> {track.isPending ? "Searching..." : "Track"}
        </Button>
      </form>

      {track.isError && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
          We couldn&apos;t find a booking with that reference. Double-check it and try again.
        </p>
      )}

      {result && (
        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-xl text-pine-900">{result.bookingReference}</p>
            {result.packages.length > 0 && (
              <p className="text-sm text-ink-muted">
                {result.packages.map((p) => p.name).join(", ")}
              </p>
            )}
          </div>

          {result.status === "CANCELLED" ? (
            <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">
              This booking has been cancelled. Contact us if you have questions.
            </p>
          ) : (
            <ol className="mt-8 flex flex-col gap-0 sm:flex-row sm:items-start">
              {steps.map((step, i) => (
                <li key={step.key} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-center">
                  <div className="flex items-center gap-2 sm:flex-col">
                    {i <= currentStep ? (
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 shrink-0 text-ink-muted/40" />
                    )}
                  </div>
                  <div className="flex-1 sm:text-center">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        i <= currentStep ? "text-pine-900" : "text-ink-muted/60"
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "hidden h-px flex-1 sm:mt-3 sm:block",
                        i < currentStep ? "bg-green-600" : "bg-black/10"
                      )}
                    />
                  )}
                </li>
              ))}
            </ol>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-black/5 pt-6 text-sm">
            <div>
              <dt className="text-ink-muted">Travel starts</dt>
              <dd className="font-medium text-pine-900">
                {new Date(result.travelDateStart).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Travelers</dt>
              <dd className="font-medium text-pine-900">{result.numberOfTravelers}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Guide assigned</dt>
              <dd className="font-medium text-pine-900">{result.hasGuideAssigned ? "Yes" : "Not yet"}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackPageInner />
    </Suspense>
  );
}
