"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DashboardSummary } from "@/types";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await apiClient.get<DashboardSummary>("/api/dashboard")).data,
    refetchInterval: 60_000,
  });
}
