"use client";

import Link from "next/link";
import { ClipboardList, Clock, PlayCircle, CheckCircle2, Users, UserCheck } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { TourRequestStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">An overview of your tour operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Requests" value={data?.cards.totalRequests ?? (isLoading ? "..." : 0)} icon={ClipboardList} />
        <StatCard label="Pending" value={data?.cards.pendingRequests ?? (isLoading ? "..." : 0)} icon={Clock} accent="brass" />
        <StatCard label="Active Tours" value={data?.cards.activeTours ?? (isLoading ? "..." : 0)} icon={PlayCircle} accent="info" />
        <StatCard label="Completed" value={data?.cards.completedTours ?? (isLoading ? "..." : 0)} icon={CheckCircle2} accent="success" />
        <StatCard label="Assigned Tours" value={data?.cards.assignedTours ?? (isLoading ? "..." : 0)} icon={UserCheck} />
        <StatCard label="Total Members" value={data?.cards.totalMembers ?? (isLoading ? "..." : 0)} icon={Users} />
        <StatCard label="Available Members" value={data?.cards.availableMembers ?? (isLoading ? "..." : 0)} icon={Users} accent="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Link href="/admin/requests" className="text-xs font-medium text-accent hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.recentRequests.length === 0 && (
              <p className="text-sm text-text-secondary">No requests yet.</p>
            )}
            {data?.recentRequests.map((request) => (
              <Link
                key={request.id}
                href={`/admin/requests/${request.id}`}
                className="flex items-center justify-between rounded-md border border-border-subtle p-3 text-sm hover:bg-surface-muted"
              >
                <div>
                  <p className="font-medium text-text-primary">{request.customer.fullName}</p>
                  <p className="text-xs text-text-secondary">{request.bookingReference}</p>
                </div>
                <TourRequestStatusBadge status={request.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recently Assigned Tours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.recentlyAssigned.length === 0 && (
              <p className="text-sm text-text-secondary">No tours assigned yet.</p>
            )}
            {data?.recentlyAssigned.map((request) => (
              <Link
                key={request.id}
                href={`/admin/requests/${request.id}`}
                className="flex items-center justify-between rounded-md border border-border-subtle p-3 text-sm hover:bg-surface-muted"
              >
                <div>
                  <p className="font-medium text-text-primary">{request.customer.fullName}</p>
                  <p className="text-xs text-text-secondary">
                    Guide: {request.assignment?.member.name ?? "-"}
                  </p>
                </div>
                <TourRequestStatusBadge status={request.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
