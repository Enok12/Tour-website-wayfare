import { tourRequestController } from "@/server/controllers/tour-request.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

type Context = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Context>(async (req, { params }) => {
  const { id } = await params;
  return tourRequestController.getById(req, id);
});

export const PUT = withErrorHandling<Context>(async (req, { params }) => {
  const { id } = await params;
  return tourRequestController.update(req, id);
});
