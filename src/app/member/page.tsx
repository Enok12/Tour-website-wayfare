"use client";

import Link from "next/link";
import { Phone, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TourRequestStatusBadge, MemberTourStatusBadge } from "@/components/shared/status-badge";
import { useTourRequests } from "@/hooks/use-tours";

export default function MemberDashboardPage() {
  const { data, isLoading } = useTourRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">My Assigned Tours</h1>
        <p className="text-sm text-text-secondary">Tours currently assigned to you.</p>
      </div>

      {isLoading && <p className="text-sm text-text-secondary">Loading your tours...</p>}

      {!isLoading && data?.items.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-text-secondary">
            You don&apos;t have any tours assigned yet. Check back soon!
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {data?.items.map((tour) => (
          <Link key={tour.id} href={`/member/tours/${tour.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-text-primary">{tour.customer.fullName}</p>
                    <p className="text-xs text-text-secondary">{tour.bookingReference}</p>
                  </div>
                  <TourRequestStatusBadge status={tour.status} />
                </div>

                <div className="space-y-1.5 text-sm text-text-secondary">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> {tour.customer.phone}
                  </p>
                  {tour.pickupDetails && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" /> {tour.pickupDetails}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> {tour.numberOfTravelers} travelers
                  </p>
                </div>

                {tour.assignment?.memberStatus && (
                  <MemberTourStatusBadge status={tour.assignment.memberStatus} />
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
