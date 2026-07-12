"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { useAvailableMembers } from "@/hooks/use-members";
import { useAssignMember } from "@/hooks/use-tours";
import { cn } from "@/lib/utils";

export function AssignMemberDialog({
  tourRequestId,
  open,
  onOpenChange,
}: {
  tourRequestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: members, isLoading } = useAvailableMembers();
  const assignMember = useAssignMember(tourRequestId);
  const [selected, setSelected] = useState<string | null>(null);

  async function handleAssign() {
    if (!selected) return;
    try {
      await assignMember.mutateAsync(selected);
      toast.success("Member assigned");
      onOpenChange(false);
      setSelected(null);
    } catch {
      toast.error("Could not assign this member");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign a member</DialogTitle>
          <DialogDescription>
            Choose one of your available guides for this tour.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-2 overflow-y-auto">
          {isLoading && <p className="text-sm text-text-secondary">Loading members...</p>}
          {!isLoading && members?.length === 0 && (
            <p className="text-sm text-text-secondary">No members are currently available.</p>
          )}
          {members?.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => setSelected(member.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors",
                selected === member.id
                  ? "border-accent bg-surface-muted"
                  : "border-border-subtle hover:bg-surface-muted"
              )}
            >
              <Avatar>
                <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{member.name}</p>
                <p className="text-xs text-text-secondary">{member.languages.join(", ") || "No languages listed"}</p>
              </div>
              <AvailabilityBadge status={member.availabilityStatus} />
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="brand" disabled={!selected || assignMember.isPending} onClick={handleAssign}>
            {assignMember.isPending ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
