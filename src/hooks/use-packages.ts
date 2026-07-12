"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { PackageDto } from "@/types";
import type { CreatePackageInput, UpdatePackageInput } from "@/server/dto/package.dto";

export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => (await apiClient.get<PackageDto[]>("/api/packages")).data,
  });
}

export function usePackageBySlug(slug: string) {
  return useQuery({
    queryKey: ["packages", "slug", slug],
    queryFn: async () => (await apiClient.get<PackageDto>(`/api/packages/slug/${slug}`)).data,
    enabled: Boolean(slug),
  });
}

export function usePackageById(id: string) {
  return useQuery({
    queryKey: ["packages", id],
    queryFn: async () => (await apiClient.get<PackageDto>(`/api/packages/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePackageInput) => apiClient.post<PackageDto>("/api/packages", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useUpdatePackage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePackageInput) => apiClient.put<PackageDto>(`/api/packages/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/packages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });
}
