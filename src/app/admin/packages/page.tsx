"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { usePackages, useDeletePackage } from "@/hooks/use-packages";
import { packageStartingPrice } from "@/lib/package-pricing";

export default function AdminPackagesPage() {
  const { data: packages, isLoading } = usePackages();
  const deletePackage = useDeletePackage();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    try {
      await deletePackage.mutateAsync(pendingDeleteId);
      toast.success("Package deleted");
    } catch {
      toast.error("Could not delete this package");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Packages</h1>
          <p className="text-sm text-text-secondary">Manage the trips customers can browse and book.</p>
        </div>
        <Button asChild variant="brand">
          <Link href="/admin/packages/new">
            <Plus className="h-4 w-4" /> New Package
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border-subtle bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-text-secondary">
                  Loading packages...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && packages?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-text-secondary">
                  No packages yet -- create your first one.
                </TableCell>
              </TableRow>
            )}
            {packages?.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{pkg.durationDays} days</TableCell>
                <TableCell>
                  {pkg.currency} {packageStartingPrice(pkg).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={pkg.isActive ? "success" : "secondary"}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="icon" variant="ghost">
                      <Link href={`/admin/packages/${pkg.id}`} aria-label="Edit package">
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete package"
                      onClick={() => setPendingDeleteId(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(pendingDeleteId)} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this package?</DialogTitle>
            <DialogDescription>
              This can&apos;t be undone. Past tour requests that reference it will keep their history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deletePackage.isPending}>
              {deletePackage.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
