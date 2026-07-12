import { MemberForm } from "@/components/admin/member-form";

export default function NewMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">New Member</h1>
        <p className="text-sm text-text-secondary">Add a trusted guide to your team.</p>
      </div>
      <MemberForm />
    </div>
  );
}
