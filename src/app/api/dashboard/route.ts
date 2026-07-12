import { NextRequest } from "next/server";
import { dashboardController } from "@/server/controllers/dashboard.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

export const GET = withErrorHandling((req: NextRequest) => dashboardController.getSummary(req));
