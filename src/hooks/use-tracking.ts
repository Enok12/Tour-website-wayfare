"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { TrackingResult } from "@/types";

export function useTrackBooking() {
  return useMutation({
    mutationFn: (bookingReference: string) =>
      apiClient.get<TrackingResult>(`/api/tracking/${encodeURIComponent(bookingReference.trim())}`),
  });
}
