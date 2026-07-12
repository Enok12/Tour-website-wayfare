import { trackingController } from "@/server/controllers/tracking.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

type Context = { params: Promise<{ bookingReference: string }> };

export const GET = withErrorHandling<Context>(async (_req, { params }) => {
  const { bookingReference } = await params;
  return trackingController.trackByReference(bookingReference);
});
