"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TourRequestStatusBadge, MemberTourStatusBadge } from "@/components/shared/status-badge";
import { useTourRequest, useUpdateMemberStatus } from "@/hooks/use-tours";
import type { MemberTourStatus } from "@prisma/client";

const nextAction: Record<"NONE" | MemberTourStatus, { next: MemberTourStatus; label: string } | null> = {
  NONE: { next: "ACCEPTED", label: "Accept Tour" },
  ACCEPTED: { next: "STARTED", label: "Start Tour" },
  STARTED: { next: "COMPLETED", label: "Mark Completed" },
  COMPLETED: null,
};

export default function MemberTourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: tour, isLoading } = useTourRequest(id);
  const updateStatus = useUpdateMemberStatus(id);

  async function handleAdvance(next: MemberTourStatus) {
    try {
      await updateStatus.mutateAsync(next);
      toast.success("Status updated");
    } catch {
      toast.error("Could not update status");
    }
  }

  if (isLoading || !tour) {
    return <p className="text-sm text-text-secondary">Loading tour...</p>;
  }

  const currentKey = tour.assignment?.memberStatus ?? "NONE";
  const action = nextAction[currentKey];

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{tour.customer.fullName}</h1>
          <p className="text-sm text-text-secondary">{tour.bookingReference}</p>
        </div>
        <div className="flex items-center gap-2">
          <TourRequestStatusBadge status={tour.status} />
          {tour.assignment?.memberStatus && <MemberTourStatusBadge status={tour.assignment.memberStatus} />}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-2 text-text-secondary">
            <Phone className="h-4 w-4" /> {tour.customer.phone}
          </p>
          <p className="flex items-center gap-2 text-text-secondary">
            <Mail className="h-4 w-4" /> {tour.customer.email}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tour Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <Detail
            label="Packages"
            value={
              tour.packages.map((p) => `${p.package.name} (${p.accommodation.name})`).join(", ") ||
              "None specified"
            }
            full
          />
          <Detail
            label="Travel dates"
            value={`${new Date(tour.travelDateStart).toLocaleDateString()}${
              tour.travelDateEnd ? ` - ${new Date(tour.travelDateEnd).toLocaleDateString()}` : ""
            }`}
          />
          <Detail label="Travelers" value={String(tour.numberOfTravelers)} />
          <Detail label="Pickup details" value={tour.pickupDetails || "Not specified"} />
          <Detail label="Destinations" value={tour.preferredDestinations.join(", ") || "None specified"} full />
          <Detail label="Activities" value={tour.activities.join(", ") || "None specified"} full />
          <Detail label="Special requests" value={tour.specialRequests || "None"} full />
        </CardContent>
      </Card>

      {tour.internalNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes from the office</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-text-primary">{tour.internalNotes}</CardContent>
        </Card>
      )}

      {action && (
        <Button variant="brand" size="lg" onClick={() => handleAdvance(action.next)} disabled={updateStatus.isPending}>
          {updateStatus.isPending ? "Updating..." : action.label}
        </Button>
      )}
    </div>
  );
}

function Detail({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-text-primary">{value}</p>
    </div>
  );
}
