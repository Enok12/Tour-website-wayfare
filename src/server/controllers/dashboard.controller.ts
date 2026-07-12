import { NextRequest } from "next/server";
import { dashboardService } from "@/server/services/dashboard.service";
import { requireRole } from "@/server/middleware/auth";
import { apiSuccess } from "@/server/lib/api-response";

export const dashboardController = {
  async getSummary(req: NextRequest) {
    await requireRole(req, ["ADMIN"]);
    const summary = await dashboardService.getSummary();
    return apiSuccess(summary);
  },
};
