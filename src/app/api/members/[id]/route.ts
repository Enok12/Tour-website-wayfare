import { memberController } from "@/server/controllers/member.controller";
import { withErrorHandling } from "@/server/middleware/with-error-handling";

type Context = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Context>(async (req, { params }) => {
  const { id } = await params;
  return memberController.getById(req, id);
});

export const PUT = withErrorHandling<Context>(async (req, { params }) => {
  const { id } = await params;
  return memberController.update(req, id);
});

// "Delete" per the spec means deactivate, not a hard delete — members have
// historical assignments/activity logs that must be preserved.
export const DELETE = withErrorHandling<Context>(async (req, { params }) => {
  const { id } = await params;
  return memberController.deactivate(req, id);
});
