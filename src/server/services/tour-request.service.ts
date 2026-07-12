import { tourRequestRepository } from "@/server/repositories/tour-request.repository";
import { customerRepository } from "@/server/repositories/customer.repository";
import { assignmentRepository } from "@/server/repositories/assignment.repository";
import { userRepository } from "@/server/repositories/user.repository";
import { activityLogRepository } from "@/server/repositories/activity-log.repository";
import { packageRepository } from "@/server/repositories/package.repository";
import { generateBookingReference } from "@/server/lib/booking-reference";
import { ForbiddenError, NotFoundError, ValidationError } from "@/server/lib/errors";
import { MemberTourStatus, Role, TourRequestStatus } from "@prisma/client";
import type {
  CreateTourRequestInput,
  ListTourRequestsQuery,
  UpdateTourRequestInput,
} from "@/server/dto/tour-request.dto";
import type { AuthenticatedUser } from "@/server/middleware/auth";

export const tourRequestService = {
  /** Public: customer submits "Customize Your Tour" with 1+ selected packages. */
  async createFromCustomer(input: CreateTourRequestInput) {
    const packages = await packageRepository.findManyByIds(input.packages.map((p) => p.packageId));
    const packageMap = new Map(packages.map((pkg) => [pkg.id, pkg]));

    const selections = input.packages.map((selection) => {
      const pkg = packageMap.get(selection.packageId);
      if (!pkg || !pkg.isActive) {
        throw new ValidationError("One of the selected packages is not available");
      }

      const attributeMap = new Map(pkg.attributes.map((attr) => [attr.id, attr]));
      const selectedAttributes = selection.attributeIds.map((attributeId) => {
        const attribute = attributeMap.get(attributeId);
        if (!attribute || !attribute.isActive) {
          throw new ValidationError(`One of the selected options for ${pkg.name} is not available`);
        }
        return attribute;
      });

      const accommodation = pkg.accommodations.find((acc) => acc.id === selection.accommodationId);
      if (!accommodation || !accommodation.isActive) {
        throw new ValidationError(`Selected accommodation for ${pkg.name} is not available`);
      }

      const priceAtBooking =
        Number(pkg.price) +
        selectedAttributes.reduce((sum, attr) => sum + Number(attr.price), 0) +
        Number(accommodation.price);

      return { pkg, selectedAttributes, accommodation, priceAtBooking };
    });

    const estimatedTotal = selections.reduce((sum, s) => sum + s.priceAtBooking, 0);

    const customer = await customerRepository.findOrCreate({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      country: input.country,
    });

    // Retry once on the (near-impossible) chance of a booking reference collision.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const request = await tourRequestRepository.create({
          bookingReference: generateBookingReference(),
          customer: { connect: { id: customer.id } },
          estimatedTotal,
          packages: {
            create: selections.map((s) => ({
              package: { connect: { id: s.pkg.id } },
              accommodation: { connect: { id: s.accommodation.id } },
              accommodationPriceAtBooking: s.accommodation.price,
              priceAtBooking: s.priceAtBooking,
              attributes: {
                create: s.selectedAttributes.map((attr) => ({
                  packageAttribute: { connect: { id: attr.id } },
                  priceAtBooking: attr.price,
                })),
              },
            })),
          },
          travelDateStart: input.travelDateStart,
          travelDateEnd: input.travelDateEnd,
          numberOfTravelers: input.numberOfTravelers,
          preferredDestinations: input.preferredDestinations,
          hotelPreference: input.hotelPreference,
          budget: input.budget,
          activities: input.activities,
          specialRequests: input.specialRequests,
        });

        await activityLogRepository.create({
          action: "TOUR_REQUEST_CREATED",
          entityType: "TourRequest",
          entityId: request.id,
          tourRequestId: request.id,
          metadata: { bookingReference: request.bookingReference },
        });

        return request;
      } catch (err) {
        const isUniqueViolation =
          typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
        if (!isUniqueViolation || attempt === 1) throw err;
      }
    }
    throw new Error("Could not generate a unique booking reference");
  },

  /** Public tracking — no auth, looked up by booking reference only. */
  async trackByBookingReference(bookingReference: string) {
    const request = await tourRequestRepository.findByBookingReference(bookingReference);
    if (!request) throw new NotFoundError("Booking");
    return request;
  },

  async getByIdForAdmin(id: string) {
    const request = await tourRequestRepository.findById(id);
    if (!request) throw new NotFoundError("Tour request");
    return request;
  },

  /** Members may only view a request that is assigned to them. */
  async getByIdForMember(id: string, memberId: string) {
    const request = await tourRequestRepository.findById(id);
    if (!request) throw new NotFoundError("Tour request");
    if (request.assignment?.memberId !== memberId) {
      throw new ForbiddenError("This tour is not assigned to you");
    }
    return request;
  },

  list(query: ListTourRequestsQuery) {
    return tourRequestRepository.list(query);
  },

  listForMember(memberId: string) {
    return tourRequestRepository.listForMember(memberId);
  },

  async update(id: string, input: UpdateTourRequestInput, actor: AuthenticatedUser) {
    const existing = await tourRequestRepository.findById(id);
    if (!existing) throw new NotFoundError("Tour request");

    const updated = await tourRequestRepository.update(id, input);

    await activityLogRepository.create({
      userId: actor.id,
      action: "TOUR_REQUEST_UPDATED",
      entityType: "TourRequest",
      entityId: id,
      tourRequestId: id,
      metadata: { fields: Object.keys(input) },
    });

    return updated;
  },

  /** Admin-only: assign (or reassign) a member to a request. */
  async assignMember(id: string, memberId: string, actor: AuthenticatedUser) {
    const request = await tourRequestRepository.findById(id);
    if (!request) throw new NotFoundError("Tour request");
    if (request.status === TourRequestStatus.CANCELLED) {
      throw new ValidationError("Cannot assign a cancelled request");
    }

    const member = await userRepository.findById(memberId);
    if (!member || member.role !== Role.MEMBER) throw new NotFoundError("Member");
    if (!member.isActive) throw new ValidationError("This member is deactivated");

    await assignmentRepository.upsert({ tourRequestId: id, memberId, assignedById: actor.id });

    const updated = await tourRequestRepository.update(id, { status: TourRequestStatus.ASSIGNED });

    await activityLogRepository.create({
      userId: actor.id,
      action: "TOUR_ASSIGNED",
      entityType: "TourRequest",
      entityId: id,
      tourRequestId: id,
      metadata: { memberId, memberName: member.name },
    });

    return updated;
  },

  /** Admin-only: manual status override (e.g. Cancel). */
  async updateStatus(id: string, status: TourRequestStatus, actor: AuthenticatedUser) {
    const existing = await tourRequestRepository.findById(id);
    if (!existing) throw new NotFoundError("Tour request");

    const updated = await tourRequestRepository.update(id, { status });

    await activityLogRepository.create({
      userId: actor.id,
      action: "STATUS_CHANGED",
      entityType: "TourRequest",
      entityId: id,
      tourRequestId: id,
      metadata: { from: existing.status, to: status },
    });

    return updated;
  },

  /** Member-only: progress their own assigned tour (Accepted → Started → Completed). */
  async updateMemberStatus(id: string, memberStatus: MemberTourStatus, actor: AuthenticatedUser) {
    const request = await tourRequestRepository.findById(id);
    if (!request) throw new NotFoundError("Tour request");
    if (request.assignment?.memberId !== actor.id) {
      throw new ForbiddenError("This tour is not assigned to you");
    }

    await assignmentRepository.updateMemberStatus(id, memberStatus);

    const overallStatus =
      memberStatus === MemberTourStatus.STARTED
        ? TourRequestStatus.IN_PROGRESS
        : memberStatus === MemberTourStatus.COMPLETED
          ? TourRequestStatus.COMPLETED
          : request.status;

    const updated = await tourRequestRepository.update(id, { status: overallStatus });

    await activityLogRepository.create({
      userId: actor.id,
      action: "MEMBER_STATUS_UPDATED",
      entityType: "TourRequest",
      entityId: id,
      tourRequestId: id,
      metadata: { memberStatus },
    });

    return updated;
  },
};
