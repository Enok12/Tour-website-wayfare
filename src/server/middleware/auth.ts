import { NextRequest } from "next/server";
import type { Role } from "@prisma/client";
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "@/server/lib/jwt";
import { ForbiddenError, UnauthorizedError } from "@/server/lib/errors";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

/**
 * Reads and verifies the access token cookie. Throws UnauthorizedError if
 * missing/invalid/expired. Use this at the top of any protected controller.
 */
export async function requireUser(req: NextRequest): Promise<AuthenticatedUser> {
  // Web clients authenticate via the httpOnly cookie. A future mobile app
  // (Android/iOS) can instead send `Authorization: Bearer <token>` since it
  // won't share the browser's cookie jar.
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? bearer;
  if (!token) throw new UnauthorizedError("Not signed in");

  const payload = await verifyAccessToken(token);
  if (!payload) throw new UnauthorizedError("Session expired, please sign in again");

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

/**
 * Same as requireUser, but also asserts the user's role is one of `roles`.
 * Admin-only endpoints: requireRole(req, ["ADMIN"])
 */
export async function requireRole(
  req: NextRequest,
  roles: Role[]
): Promise<AuthenticatedUser> {
  const user = await requireUser(req);
  if (!roles.includes(user.role)) {
    throw new ForbiddenError(`This action requires one of the following roles: ${roles.join(", ")}`);
  }
  return user;
}
