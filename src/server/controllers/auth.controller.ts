import { NextRequest } from "next/server";
import { authService } from "@/server/services/auth.service";
import { loginSchema } from "@/server/dto/auth.dto";
import { parseBody } from "@/server/middleware/validate";
import { requireUser } from "@/server/middleware/auth";
import { apiSuccess } from "@/server/lib/api-response";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/server/lib/jwt";

const isProd = process.env.NODE_ENV === "production";

export const authController = {
  async login(req: NextRequest) {
    const input = await parseBody(req, loginSchema);
    const { user, accessToken, refreshToken } = await authService.login(input);

    // Web clients rely on the httpOnly cookies set below. The token is also
    // returned in the body so a future native mobile app (which can't easily
    // use httpOnly cookies) can store it itself, e.g. in secure storage.
    const response = apiSuccess({ user, accessToken });

    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  },

  async logout() {
    const response = apiSuccess({ loggedOut: true });
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
  },

  async me(req: NextRequest) {
    const authUser = await requireUser(req);
    const user = await authService.getCurrentUser(authUser.id);
    return apiSuccess({ user });
  },
};
