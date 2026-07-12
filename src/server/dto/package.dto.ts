import { z } from "zod";

// A selectable, priced sub-location/activity within a package (e.g. "Temple
// of the Tooth" under the Kandy package). `id` is present only when editing
// an existing attribute — its absence tells the service to create a new one.
export const packageAttributeSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().max(500).optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  isActive: z.boolean().default(true),
});

// A selectable hotel/stay option within a package (e.g. "Jetwing Kandy
// Gallery - Luxury"), shown to customers as an image tile. `id` is present
// only when editing an existing accommodation.
export const packageAccommodationSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().max(500).optional(),
  image: z.string().url().optional().or(z.literal("")),
  starRating: z.coerce.number().int().min(1).max(5).default(3),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  isActive: z.boolean().default(true),
});

export const createPackageSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  durationDays: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  currency: z.string().trim().length(3).default("USD"),
  coverImage: z.string().url().optional().or(z.literal("")),
  galleryImages: z.array(z.string().url()).default([]),
  includedServices: z.array(z.string().trim().min(1)).default([]),
  excludedServices: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
  attributes: z.array(packageAttributeSchema).default([]),
  accommodations: z.array(packageAccommodationSchema).default([]),
});

export const updatePackageSchema = createPackageSchema.partial();

export type PackageAttributeInput = z.infer<typeof packageAttributeSchema>;
export type PackageAccommodationInput = z.infer<typeof packageAccommodationSchema>;
export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
