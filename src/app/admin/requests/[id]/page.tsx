"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TourRequestStatusBadge, MemberTourStatusBadge } from "@/components/shared/status-badge";
import { AssignMemberDialog } from "@/components/admin/assign-member-dialog";
import { useTourRequest, useUpdateTourRequest, useUpdateTourStatus } from "@/hooks/use-tours";
import Link from "next/link";
import type { TourRequestStatus } from "@prisma/client";

export default function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: request, isLoading } = useTourRequest(id);
  const updateRequest = useUpdateTourRequest(id);
  const updateStatus = useUpdateTourStatus(id);

  const [notes, setNotes] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);

  useEffect(() => {
    if (request) setNotes(request.internalNotes ?? "");
  }, [request]);

  async function saveNotes() {
    try {
      await updateRequest.mutateAsync({ internalNotes: notes });
      toast.success("Notes saved");
    } catch {
      toast.error("Could not save notes");
    }
  }

  async function changeStatus(status: TourRequestStatus) {
    try {
      await updateStatus.mutateAsync(status);
      toast.success("Status updated");
    } catch {
      toast.error("Could not update status");
    }
  }

  if (isLoading || !request) {
    return <p className="text-sm text-text-secondary">Loading request...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{request.bookingReference}</h1>
          <p className="text-sm text-text-secondary">
            Submitted {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TourRequestStatusBadge status={request.status} />
          <Select value={request.status} onValueChange={(v) => changeStatus(v as TourRequestStatus)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Selected Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.packages.length === 0 && (
                <p className="text-sm text-text-secondary">No packages selected.</p>
              )}
              {request.packages.map((selection) => (
                <div key={selection.id} className="rounded-lg border border-border-subtle p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-text-primary">{selection.package.name}</p>
                    <p className="font-medium text-text-primary">${selection.priceAtBooking}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-text-secondary">
                    <span>Accommodation: {selection.accommodation.name}</span>
                    <span>${selection.accommodationPriceAtBooking}</span>
                  </div>
                  {selection.attributes.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                      {selection.attributes.map((attr) => (
                        <li key={attr.id} className="flex items-center justify-between">
                          <span>{attr.packageAttribute.name}</span>
                          <span>${attr.priceAtBooking}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {request.estimatedTotal && (
                <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                  <p className="font-medium text-text-primary">Estimated total</p>
                  <p className="font-semibold text-text-primary">${request.estimatedTotal}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Detail
                label="Travel dates"
                value={`${new Date(request.travelDateStart).toLocaleDateString()}${
                  request.travelDateEnd ? ` - ${new Date(request.travelDateEnd).toLocaleDateString()}` : ""
                }`}
              />
              <Detail label="Travelers" value={String(request.numberOfTravelers)} />
              <Detail label="Budget" value={request.budget ? `$${request.budget}` : "Not specified"} />
              <Detail label="Hotel preference" value={request.hotelPreference || "Not specified"} />
              <Detail label="Pickup details" value={request.pickupDetails || "Not specified"} />
              <Detail
                label="Preferred destinations"
                value={request.preferredDestinations.join(", ") || "None specified"}
                full
              />
              <Detail label="Activities" value={request.activities.join(", ") || "None specified"} full />
              <Detail label="Special requests" value={request.specialRequests || "None"} full />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Notes only visible to admins..."
              />
              <Button size="sm" variant="brand" onClick={saveNotes} disabled={updateRequest.isPending}>
                {updateRequest.isPending ? "Saving..." : "Save Notes"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium text-text-primary">{request.customer.fullName}</p>
              <p className="text-text-secondary">{request.customer.email}</p>
              <p className="text-text-secondary">{request.customer.phone}</p>
              {request.customer.country && <p className="text-text-secondary">{request.customer.country}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Assigned Guide</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
                <UserPlus className="h-4 w-4" />
                {request.assignment ? "Reassign" : "Assign"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {request.assignment ? (
                <>
                  <p className="font-medium text-text-primary">{request.assignment.member.name}</p>
                  <p className="text-text-secondary">{request.assignment.member.email}</p>
                  {request.assignment.memberStatus && (
                    <MemberTourStatusBadge status={request.assignment.memberStatus} />
                  )}
                </>
              ) : (
                <p className="text-text-secondary">No guide assigned yet.</p>
              )}
            </CardContent>
          </Card>

          <Link href="/admin/requests" className="block text-center text-sm text-accent hover:underline">
            Back to all requests
          </Link>
        </div>
      </div>

      <AssignMemberDialog tourRequestId={id} open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  );
}

function Detail({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-sm text-text-primary">{value}</p>
    </div>
  );
}
