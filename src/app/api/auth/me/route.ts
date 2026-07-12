import { NextRequest } from "next/server";
import { authController } from "@/server/controllers/auth.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

export const GET = withErrorHandling((req: NextRequest) => authController.me(req));
