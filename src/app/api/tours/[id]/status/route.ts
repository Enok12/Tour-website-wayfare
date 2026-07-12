import { NextRequest } from "next/server";
import { tourRequestController } from "@/server/controllers/tour-request.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

type Context = { params: Promise<{ id: string }> };

export const PATCH = withErrorHandling<Context>(async (req: NextRequest, { params }) => {
  const { id } = await params;
  return tourRequestController.updateStatus(req, id);
});
