import { NextRequest } from "next/server";
import { tourRequestService } from "@/server/services/tour-request.service";
import {
  assignMemberSchema,
  createTourRequestSchema,
  listTourRequestsQuerySchema,
  updateMemberStatusSchema,
  updateRequestStatusSchema,
  updateTourRequestSchema,
} from "@/server/dto/tour-request.dto";
import { parseBody, parseQuery } from "@/server/middleware/validate";
import { requireRole, requireUser } from "@/server/middleware/auth";
import { apiSuccess } from "@/server/lib/api-response";

export const tourRequestController = {
  /** Public: the "Customize Your Tour" form (and package booking) hit this. */
  async createPublic(req: NextRequest) {
    const input = await parseBody(req, createTourRequestSchema);
    const request = await tourRequestService.createFromCustomer(input);
    return apiSuccess(
      { bookingReference: request.bookingReference, id: request.id },
      undefined,
      201
    );
  },

  async list(req: NextRequest) {
    const user = await requireUser(req);

    if (user.role === "MEMBER") {
      const requests = await tourRequestService.listForMember(user.id);
      return apiSuccess(requests);
    }

    const query = parseQuery(req, listTourRequestsQuerySchema);
    const { items, total } = await tourRequestService.list(query);
    return apiSuccess(items, {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    });
  },

  async getById(req: NextRequest, id: string) {
    const user = await requireUser(req);
    const request =
      user.role === "MEMBER"
        ? await tourRequestService.getByIdForMember(id, user.id)
        : await tourRequestService.getByIdForAdmin(id);
    return apiSuccess(request);
  },

  async update(req: NextRequest, id: string) {
    const user = await requireRole(req, ["ADMIN"]);
    const input = await parseBody(req, updateTourRequestSchema);
    const request = await tourRequestService.update(id, input, user);
    return apiSuccess(request);
  },

  async assign(req: NextRequest, id: string) {
    const user = await requireRole(req, ["ADMIN"]);
    const { memberId } = await parseBody(req, assignMemberSchema);
    const request = await tourRequestService.assignMember(id, memberId, user);
    return apiSuccess(request);
  },

  async updateStatus(req: NextRequest, id: string) {
    const user = await requireRole(req, ["ADMIN"]);
    const { status } = await parseBody(req, updateRequestStatusSchema);
    const request = await tourRequestService.updateStatus(id, status, user);
    return apiSuccess(request);
  },

  async updateMemberStatus(req: NextRequest, id: string) {
    const user = await requireRole(req, ["MEMBER"]);
    const { memberStatus } = await parseBody(req, updateMemberStatusSchema);
    const request = await tourRequestService.updateMemberStatus(id, memberStatus, user);
    return apiSuccess(request);
  },
};
