import { NextRequest } from "next/server";
import { packageService } from "@/server/services/package.service";
import { createPackageSchema, updatePackageSchema } from "@/server/dto/package.dto";
import { parseBody } from "@/server/middleware/validate";
import { requireRole } from "@/server/middleware/auth";
import { verifyAccessToken } from "@/server/lib/jwt";
import { ACCESS_TOKEN_COOKIE } from "@/server/lib/jwt";
import { apiSuccess } from "@/server/lib/api-response";

export const packageController = {
  /**
   * Active-only for anonymous/customer requests; all packages (including
   * inactive) for an authenticated admin. Checked here rather than requiring
   * auth outright, since this endpoint also powers the public landing page.
   */
  async list(req: NextRequest) {
    const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? bearer;
    const payload = token ? await verifyAccessToken(token) : null;
    const isAdmin = payload?.role === "ADMIN";

    const packages = isAdmin ? await packageService.listAll() : await packageService.listPublic();
    return apiSuccess(packages);
  },

  async getPublicBySlug(slug: string) {
    const pkg = await packageService.getBySlug(slug);
    return apiSuccess(pkg);
  },

  async getAdmin(req: NextRequest, id: string) {
    await requireRole(req, ["ADMIN"]);
    const pkg = await packageService.getById(id);
    return apiSuccess(pkg);
  },

  async create(req: NextRequest) {
    await requireRole(req, ["ADMIN"]);
    const input = await parseBody(req, createPackageSchema);
    const pkg = await packageService.create(input);
    return apiSuccess(pkg, undefined, 201);
  },

  async update(req: NextRequest, id: string) {
    await requireRole(req, ["ADMIN"]);
    const input = await parseBody(req, updatePackageSchema);
    const pkg = await packageService.update(id, input);
    return apiSuccess(pkg);
  },

  async remove(req: NextRequest, id: string) {
    await requireRole(req, ["ADMIN"]);
    await packageService.delete(id);
    return apiSuccess({ deleted: true });
  },
};
