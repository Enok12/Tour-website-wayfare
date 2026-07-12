"use client";

import { use } from "react";
import { MemberForm } from "@/components/admin/member-form";
import { useMember } from "@/hooks/use-members";

export default function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: member, isLoading } = useMember(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Edit Member</h1>
        <p className="text-sm text-text-secondary">Update this guide&apos;s details.</p>
      </div>
      {isLoading || !member ? (
        <p className="text-sm text-text-secondary">Loading member...</p>
      ) : (
        <MemberForm initial={member} />
      )}
    </div>
  );
}
