"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { TourRequestDto } from "@/types";
import type { CreateTourRequestInput, UpdateTourRequestInput } from "@/server/dto/tour-request.dto";
import type { TourRequestStatus, MemberTourStatus } from "@prisma/client";

interface ListFilters {
  status?: TourRequestStatus | "ALL";
  search?: string;
  page?: number;
  pageSize?: number;
}

function buildQuery(filters: ListFilters) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "ALL") params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  params.set("page", String(filters.page ?? 1));
  params.set("pageSize", String(filters.pageSize ?? 20));
  return params.toString();
}

/** Works for both roles: admins get the full filterable list, members get only their assigned tours. */
export function useTourRequests(filters: ListFilters = {}) {
  return useQuery({
    queryKey: ["tours", filters],
    queryFn: async () => {
      const res = await apiClient.get<TourRequestDto[]>(`/api/tours?${buildQuery(filters)}`);
      return { items: res.data, meta: res.meta };
    },
  });
}

export function useTourRequest(id: string) {
  return useQuery({
    queryKey: ["tours", id],
    queryFn: async () => (await apiClient.get<TourRequestDto>(`/api/tours/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCreateTourRequest() {
  return useMutation({
    mutationFn: (input: CreateTourRequestInput) =>
      apiClient.post<{ bookingReference: string; id: string }>("/api/tours", input),
  });
}

export function useUpdateTourRequest(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTourRequestInput) => apiClient.put<TourRequestDto>(`/api/tours/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours", id] });
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}

export function useAssignMember(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      apiClient.patch<TourRequestDto>(`/api/tours/${id}/assign`, { memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useUpdateTourStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: TourRequestStatus) =>
      apiClient.patch<TourRequestDto>(`/api/tours/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateMemberStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberStatus: MemberTourStatus) =>
      apiClient.patch<TourRequestDto>(`/api/tours/${id}/member-status`, { memberStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}
