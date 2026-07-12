import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/server/lib/errors";
import { apiError } from "@/server/lib/api-response";
import { logger } from "@/server/lib/logger";

type RouteHandler<TContext = unknown> = (
  req: NextRequest,
  context: TContext
) => Promise<NextResponse>;

// Every API route is wrapped with this so controllers can just `throw`
// (AppError subclasses, ZodError, or anything else) and always get back a
// consistent JSON error envelope with the right HTTP status.
export function withErrorHandling<TContext = unknown>(
  handler: RouteHandler<TContext>
): RouteHandler<TContext> {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (err) {
      if (err instanceof AppError) {
        if (err.statusCode >= 500) {
          logger.error(err.message, { code: err.code, stack: err.stack });
        }
        return apiError(err.message, err.statusCode, err.code, err.details);
      }

      if (err instanceof ZodError) {
        return apiError("Validation failed", 400, "VALIDATION_ERROR", err.flatten());
      }

      logger.error("Unhandled error in API route", {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        path: req.nextUrl?.pathname,
      });

      return apiError("An unexpected error occurred", 500, "INTERNAL_SERVER_ERROR");
    }
  };
}
