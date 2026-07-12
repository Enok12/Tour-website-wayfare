import { tourRequestService } from "@/server/services/tour-request.service";
import { apiSuccess } from "@/server/lib/api-response";

export const trackingController = {
  async trackByReference(bookingReference: string) {
    const request = await tourRequestService.trackByBookingReference(bookingReference);

    // Public endpoint: deliberately exclude internalNotes, the assigned
    // member's contact details, and any other admin-only data.
    return apiSuccess({
      bookingReference: request.bookingReference,
      status: request.status,
      travelDateStart: request.travelDateStart,
      travelDateEnd: request.travelDateEnd,
      numberOfTravelers: request.numberOfTravelers,
      packages: request.packages.map((p) => ({ name: p.package.name, slug: p.package.slug })),
      createdAt: request.createdAt,
      hasGuideAssigned: Boolean(request.assignment),
    });
  },
};
