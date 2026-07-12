import { NextRequest } from "next/server";
import { packageController } from "@/server/controllers/package.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

// GET is intentionally usable by both the public landing page (active
// packages only) and the admin packages table (all packages, including
// inactive) — the controller decides based on whether a valid admin
// session is present, so the frontend doesn't need two different URLs.
export const GET = withErrorHandling((req: NextRequest) => packageController.list(req));
export const POST = withErrorHandling((req: NextRequest) => packageController.create(req));
