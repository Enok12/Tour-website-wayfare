import { packageController } from "@/server/controllers/package.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

type Context = { params: Promise<{ slug: string }> };

export const GET = withErrorHandling<Context>(async (_req, { params }) => {
  const { slug } = await params;
  return packageController.getPublicBySlug(slug);
});
