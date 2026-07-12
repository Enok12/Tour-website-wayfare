import { NextRequest } from "next/server";
import { tourRequestController } from "@/server/controllers/tour-request.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

// GET: admins get the full paginated/filterable list; members get only
// their own assigned tours. POST is public — this is how a customer's
// "Customize Your Tour" submission (or package booking) becomes a request.
export const GET = withErrorHandling((req: NextRequest) => tourRequestController.list(req));
export const POST = withErrorHandling((req: NextRequest) => tourRequestController.createPublic(req));
