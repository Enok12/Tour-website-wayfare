import { NextRequest } from "next/server";
import { memberService } from "@/server/services/member.service";
import { createMemberSchema, updateMemberSchema } from "@/server/dto/member.dto";
import { parseBody } from "@/server/middleware/validate";
import { requireRole } from "@/server/middleware/auth";
import { apiSuccess } from "@/server/lib/api-response";

export const memberController = {
  async list(req: NextRequest) {
    await requireRole(req, ["ADMIN"]);
    const search = req.nextUrl.searchParams.get("search") ?? undefined;
    const availableOnly = req.nextUrl.searchParams.get("availableOnly") === "true";

    const members = availableOnly
      ? await memberService.listAvailable()
      : await memberService.list(search);

    return apiSuccess(members);
  },

  async getById(req: NextRequest, id: string) {
    await requireRole(req, ["ADMIN"]);
    const member = await memberService.getById(id);
    return apiSuccess(member);
  },

  async create(req: NextRequest) {
    await requireRole(req, ["ADMIN"]);
    const input = await parseBody(req, createMemberSchema);
    const member = await memberService.create(input);
    return apiSuccess(member, undefined, 201);
  },

  async update(req: NextRequest, id: string) {
    await requireRole(req, ["ADMIN"]);
    const input = await parseBody(req, updateMemberSchema);
    const member = await memberService.update(id, input);
    return apiSuccess(member);
  },

  async deactivate(req: NextRequest, id: string) {
    await requireRole(req, ["ADMIN"]);
    const member = await memberService.deactivate(id);
    return apiSuccess(member);
  },
};
