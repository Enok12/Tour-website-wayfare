import { z } from "zod";
import { AvailabilityStatus } from "@prisma/client";

export const createMemberSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().trim().optional(),
  profileImage: z.string().url().optional().or(z.literal("")),
  languages: z.array(z.string().trim().min(1)).default([]),
  availabilityStatus: z.nativeEnum(AvailabilityStatus).default(AvailabilityStatus.OFFLINE),
});

export const updateMemberSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  profileImage: z.string().url().optional().or(z.literal("")),
  languages: z.array(z.string().trim().min(1)).optional(),
  availabilityStatus: z.nativeEnum(AvailabilityStatus).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
