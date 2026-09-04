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
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-36 sm:px-6 lg:pb-28 lg:pt-40">
      <PageHeader
        eyebrow="Track your booking"
        title="Where is"
        accent="my trip?"
        subtitle="Enter the booking reference you received after submitting your request."
      />

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="TRK-2026-XXXX"
          className="h-12 rounded-full border-pine-900/15 bg-white px-5 font-display text-base uppercase tracking-[0.12em] text-pine-900 shadow-none focus-visible:ring-brass-500"
        />
        <Button type="submit" variant="brand" size="pill" disabled={track.isPending} className="shrink-0">
          <Search className="h-4 w-4" /> {track.isPending ? "Searching..." : "Track"}
        </Button>
      </form>

      {track.isError && (
        <p className="mt-6 rounded-xl border border-terracotta/25 bg-terracotta/8 px-5 py-4 text-sm text-terracotta-dark">
          We couldn&apos;t find a booking with that reference. Double-check it and try again.
        </p>
      )}

      {result && (
        <div className="mt-10 rounded-3xl bg-white p-7 shadow-card sm:p-9">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-[1.75rem] font-semibold tracking-wide text-pine-900">{result.bookingReference}</p>
            {result.packages.length > 0 && (
              <p className="text-sm text-ink-muted">
                {result.packages.map((p) => p.name).join(", ")}
              </p>
            )}
          </div>

          {result.status === "CANCELLED" ? (
            <p className="mt-6 rounded-xl border border-terracotta/25 bg-terracotta/8 px-5 py-4 text-sm text-terracotta-dark">
              This booking has been cancelled. Contact us if you have questions.
            </p>
          ) : (
            <ol className="mt-8 flex flex-col gap-0 sm:flex-row sm:items-start">
              {steps.map((step, i) => (
                <li key={step.key} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-center">
                  <div className="flex items-center gap-2 sm:flex-col">
                    {i <= currentStep ? (
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-pine-700" />
                    ) : (
                      <Circle className="h-6 w-6 shrink-0 text-pine-900/20" />
                    )}
                  </div>
                  <div className="flex-1 sm:text-center">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        i <= currentStep ? "text-pine-900" : "text-ink-subtle"
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "hidden h-px flex-1 sm:mt-3 sm:block",
                        i < currentStep ? "bg-brass-500" : "bg-pine-900/10"
                      )}
                    />
                  )}
                </li>
              ))}
            </ol>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-pine-900/8 pt-7 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Travel starts</dt>
              <dd className="mt-1 font-display text-[1.125rem] font-semibold text-pine-900">
                {new Date(result.travelDateStart).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Travelers</dt>
              <dd className="mt-1 font-display text-[1.125rem] font-semibold text-pine-900">{result.numberOfTravelers}</dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink-subtle">Guide assigned</dt>
              <dd className="mt-1 font-display text-[1.125rem] font-semibold text-pine-900">{result.hasGuideAssigned ? "Yes" : "Not yet"}</dd>
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
