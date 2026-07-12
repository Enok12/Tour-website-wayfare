"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMembers, useDeactivateMember } from "@/hooks/use-members";

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const { data: members, isLoading } = useMembers(search);
  const deactivateMember = useDeactivateMember();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function confirmDeactivate() {
    if (!pendingId) return;
    try {
      await deactivateMember.mutateAsync(pendingId);
      toast.success("Member deactivated");
    } catch {
      toast.error("Could not deactivate this member");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Members</h1>
          <p className="text-sm text-text-secondary">Your trusted guides available for assignment.</p>
        </div>
        <Button asChild variant="brand">
          <Link href="/admin/members/new">
            <Plus className="h-4 w-4" /> New Member
          </Link>
        </Button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="max-w-sm"
      />

      <div className="rounded-lg border border-border-subtle bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-text-secondary">
                  Loading members...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && members?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-text-secondary">
                  No members yet -- add your first guide.
                </TableCell>
              </TableRow>
            )}
            {members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-text-secondary">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.languages.join(", ") || "-"}</TableCell>
                <TableCell>
                  <AvailabilityBadge status={member.availabilityStatus} />
                </TableCell>
                <TableCell>
                  <Badge variant={member.isActive ? "success" : "secondary"}>
                    {member.isActive ? "Active" : "Deactivated"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="icon" variant="ghost">
                      <Link href={`/admin/members/${member.id}`} aria-label="Edit member">
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    {member.isActive && (
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Deactivate member"
                        onClick={() => setPendingId(member.id)}
                      >
                        <UserX className="h-4 w-4 text-danger" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(pendingId)} onOpenChange={(open) => !open && setPendingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate this member?</DialogTitle>
            <DialogDescription>
              They&apos;ll no longer be assignable to new tours, but their history will be kept.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeactivate} disabled={deactivateMember.isPending}>
              {deactivateMember.isPending ? "Deactivating..." : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
