import { Badge } from "@/components/ui/badge";
import type { TourRequestStatus, MemberTourStatus, AvailabilityStatus } from "@prisma/client";

const requestStatusConfig: Record<TourRequestStatus, { label: string; variant: "secondary" | "brass" | "info" | "success" | "danger" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  ASSIGNED: { label: "Assigned", variant: "brass" },
  IN_PROGRESS: { label: "In Progress", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
};

export function TourRequestStatusBadge({ status }: { status: TourRequestStatus }) {
  const config = requestStatusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

const memberStatusConfig: Record<MemberTourStatus, { label: string; variant: "secondary" | "info" | "success" }> = {
  ACCEPTED: { label: "Accepted", variant: "secondary" },
  STARTED: { label: "Started", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
};

export function MemberTourStatusBadge({ status }: { status: MemberTourStatus }) {
  const config = memberStatusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

const availabilityConfig: Record<AvailabilityStatus, { label: string; variant: "success" | "warning" | "secondary" }> = {
  AVAILABLE: { label: "Available", variant: "success" },
  BUSY: { label: "Busy", variant: "warning" },
  OFFLINE: { label: "Offline", variant: "secondary" },
};

export function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const config = availabilityConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
