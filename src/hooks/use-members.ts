"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { MemberDto } from "@/types";
import type { CreateMemberInput, UpdateMemberInput } from "@/server/dto/member.dto";

export function useMembers(search?: string) {
  return useQuery({
    queryKey: ["members", { search }],
    queryFn: async () =>
      (await apiClient.get<MemberDto[]>(`/api/members${search ? `?search=${encodeURIComponent(search)}` : ""}`))
        .data,
  });
}

export function useAvailableMembers() {
  return useQuery({
    queryKey: ["members", "available"],
    queryFn: async () => (await apiClient.get<MemberDto[]>("/api/members?availableOnly=true")).data,
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: ["members", id],
    queryFn: async () => (await apiClient.get<MemberDto>(`/api/members/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMemberInput) => apiClient.post<MemberDto>("/api/members", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useUpdateMember(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMemberInput) => apiClient.put<MemberDto>(`/api/members/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useDeactivateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<MemberDto>(`/api/members/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
}
