import type {
  Role,
  TourRequestStatus,
  MemberTourStatus,
  AvailabilityStatus,
} from "@prisma/client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  profileImage: string | null;
  languages: string[];
  availabilityStatus: AvailabilityStatus;
  isActive: boolean;
}

export interface PackageAttributeDto {
  id: string;
  name: string;
  description: string | null;
  price: string; // Prisma Decimal is serialized as a string over JSON
  isActive: boolean;
  sortOrder: number;
}

export interface PackageAccommodationDto {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  starRating: number;
  price: string; // Prisma Decimal is serialized as a string over JSON
  isActive: boolean;
  sortOrder: number;
}

export interface PackageDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationDays: number;
  price: string; // Prisma Decimal is serialized as a string over JSON
  currency: string;
  coverImage: string | null;
  galleryImages: string[];
  includedServices: string[];
  excludedServices: string[];
  isActive: boolean;
  attributes: PackageAttributeDto[];
  accommodations: PackageAccommodationDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MemberDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  languages: string[];
  availabilityStatus: AvailabilityStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string | null;
}

export interface AssignmentDto {
  id: string;
  memberStatus: MemberTourStatus | null;
  assignedAt: string;
  member: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    profileImage: string | null;
  };
}

export interface TourRequestPackageAttributeDto {
  id: string;
  priceAtBooking: string;
  packageAttribute: { id: string; name: string; price: string };
}

export interface TourRequestPackageDto {
  id: string;
  package: { id: string; name: string; slug: string };
  accommodation: { id: string; name: string; image: string | null; price: string };
  accommodationPriceAtBooking: string;
  priceAtBooking: string;
  attributes: TourRequestPackageAttributeDto[];
}

export interface TourRequestDto {
  id: string;
  bookingReference: string;
  status: TourRequestStatus;
  customer: CustomerDto;
  packages: TourRequestPackageDto[];
  estimatedTotal: string | null;
  travelDateStart: string;
  travelDateEnd: string | null;
  numberOfTravelers: number;
  preferredDestinations: string[];
  hotelPreference: string | null;
  budget: string | null;
  activities: string[];
  specialRequests: string | null;
  pickupDetails: string | null;
  internalNotes: string | null;
  assignment: AssignmentDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  cards: {
    totalRequests: number;
    pendingRequests: number;
    assignedTours: number;
    activeTours: number;
    completedTours: number;
    totalMembers: number;
    availableMembers: number;
  };
  recentRequests: TourRequestDto[];
  recentlyAssigned: TourRequestDto[];
}

export interface TrackingResult {
  bookingReference: string;
  status: TourRequestStatus;
  travelDateStart: string;
  travelDateEnd: string | null;
  numberOfTravelers: number;
  packages: { name: string; slug: string }[];
  createdAt: string;
  hasGuideAssigned: boolean;
}
