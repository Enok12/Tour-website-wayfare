import { authController } from "@/server/controllers/auth.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

export const POST = withErrorHandling(() => authController.logout());
