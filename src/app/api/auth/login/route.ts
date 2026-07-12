import { NextRequest } from "next/server";
import { authController } from "@/server/controllers/auth.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

export const POST = withErrorHandling((req: NextRequest) => authController.login(req));
