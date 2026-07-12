import { packageController } from "@/server/controllers/package.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

type Context = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Context>(async (req, { params }) => {
  const { id } = await params;
  return packageController.getAdmin(req, id);
});

export const PUT = withErrorHandling<Context>(async (req, { params }) => {
  const { id } = await params;
  return packageController.update(req, id);
});

export const DELETE = withErrorHandling<Context>(async (req, { params }) => {
  const { id } = await params;
  return packageController.remove(req, id);
});
