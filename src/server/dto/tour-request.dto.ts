import { z } from "zod";
import { MemberTourStatus, TourRequestStatus } from "@prisma/client";

// Optional form inputs (date/number) submit "" rather than undefined when
// left blank — z.coerce would otherwise try to coerce "" itself (an invalid
// date, or 0 for numbers) instead of treating it as absent, failing
// validation silently since these fields render no error message.
const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);
const optionalCoercedDate = z.preprocess(emptyToUndefined, z.coerce.date().optional());
const optionalCoercedPositiveNumber = z.preprocess(emptyToUndefined, z.coerce.number().positive().optional());

// One package selected in the "Customize Your Tour" form: which of the
// package's itinerary locations the customer kept (at least one — this is
// what the package's price is built from), whichever optional attributes
// they added on top, and their one required accommodation choice.
export const tourRequestPackageSelectionSchema = z.object({
  packageId: z.string().min(1),
  locationIds: z.array(z.string()).min(1, "Select at least one location to visit"),
  accommodationId: z.string().min(1, "Select an accommodation for this package"),
  attributeIds: z.array(z.string()).default([]),
});

// Used by the public "Customize Your Tour" form and package booking form.
// No auth required — this is how customers create a request.
export const createTourRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  country: z.string().trim().optional(),

  packages: z
    .array(tourRequestPackageSelectionSchema)
    .min(1, "Select at least one package")
    .refine(
      (packages) => new Set(packages.map((p) => p.packageId)).size === packages.length,
      "Each package can only be selected once"
    ),

  travelDateStart: z.coerce.date({ message: "Travel start date is required" }),
  travelDateEnd: optionalCoercedDate,
  numberOfTravelers: z.coerce.number().int().min(1).default(1),
  preferredDestinations: z.array(z.string().trim().min(1)).default([]),
  hotelPreference: z.string().trim().optional(),
  budget: optionalCoercedPositiveNumber,
  activities: z.array(z.string().trim().min(1)).default([]),
  specialRequests: z.string().trim().max(2000).optional(),
});

export type TourRequestPackageSelectionInput = z.infer<typeof tourRequestPackageSelectionSchema>;
export type CreateTourRequestInput = z.infer<typeof createTourRequestSchema>;

// Admin editing an existing request's trip details / internal notes.
export const updateTourRequestSchema = z.object({
  travelDateStart: optionalCoercedDate,
  travelDateEnd: optionalCoercedDate,
  numberOfTravelers: z.coerce.number().int().min(1).optional(),
  preferredDestinations: z.array(z.string().trim().min(1)).optional(),
  hotelPreference: z.string().trim().optional(),
  budget: optionalCoercedPositiveNumber,
  activities: z.array(z.string().trim().min(1)).optional(),
  specialRequests: z.string().trim().max(2000).optional(),
  pickupDetails: z.string().trim().max(1000).optional(),
  internalNotes: z.string().trim().max(4000).optional(),
});

export type UpdateTourRequestInput = z.infer<typeof updateTourRequestSchema>;

// Admin assigning (or reassigning) a member to a request.
export const assignMemberSchema = z.object({
  memberId: z.string().min(1, "Select a member to assign"),
});

export type AssignMemberInput = z.infer<typeof assignMemberSchema>;

// Admin manually changing overall request status (e.g. Cancel).
export const updateRequestStatusSchema = z.object({
  status: z.nativeEnum(TourRequestStatus),
});

export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;

// Member updating their own progress on an assigned tour.
export const updateMemberStatusSchema = z.object({
  memberStatus: z.nativeEnum(MemberTourStatus),
});

export type UpdateMemberStatusInput = z.infer<typeof updateMemberStatusSchema>;

export const listTourRequestsQuerySchema = z.object({
  status: z.nativeEnum(TourRequestStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});

export type ListTourRequestsQuery = z.infer<typeof listTourRequestsQuerySchema>;
