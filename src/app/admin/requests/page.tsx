"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TourRequestStatusBadge } from "@/components/shared/status-badge";
import { useTourRequests } from "@/hooks/use-tours";
import type { TourRequestStatus } from "@prisma/client";

const statusOptions: { value: TourRequestStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminRequestsPage() {
  const [status, setStatus] = useState<TourRequestStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTourRequests({ status, search, page, pageSize: 15 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Tour Requests</h1>
        <p className="text-sm text-text-secondary">Review, assign, and track every request.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, or reference"
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as TourRequestStatus | "ALL");
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border-subtle bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>Guide</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-text-secondary">
                  Loading requests...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-text-secondary">
                  No requests match these filters.
                </TableCell>
              </TableRow>
            )}
            {data?.items.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Link href={`/admin/requests/${request.id}`} className="font-medium text-accent hover:underline">
                    {request.bookingReference}
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{request.customer.fullName}</p>
                  <p className="text-xs text-text-secondary">{request.customer.email}</p>
                </TableCell>
                <TableCell>{new Date(request.travelDateStart).toLocaleDateString()}</TableCell>
                <TableCell>{request.assignment?.member.name ?? "Unassigned"}</TableCell>
                <TableCell>
                  <TourRequestStatusBadge status={request.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (data.meta.totalPages ?? 1) > 1 && (
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <p>
            Page {data.meta.page} of {data.meta.totalPages} &middot; {data.meta.total} total
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= (data.meta.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
