import { NextRequest } from "next/server";
import { memberController } from "@/server/controllers/member.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

export const GET = withErrorHandling((req: NextRequest) => memberController.list(req));
export const POST = withErrorHandling((req: NextRequest) => memberController.create(req));
