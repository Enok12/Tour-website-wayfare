import { prisma } from "@/server/lib/prisma";
import { Prisma, TourRequestStatus } from "@prisma/client";

const detailInclude = {
  customer: true,
  packages: {
    include: {
      package: true,
      accommodation: true,
      locations: { include: { packageLocation: true } },
      attributes: { include: { packageAttribute: true } },
    },
  },
  assignment: {
    include: {
      member: {
        select: { id: true, name: true, email: true, phone: true, profileImage: true },
      },
    },
  },
} satisfies Prisma.TourRequestInclude;

export const tourRequestRepository = {
  create(data: Prisma.TourRequestCreateInput) {
    return prisma.tourRequest.create({ data, include: detailInclude });
  },

  findById(id: string) {
    return prisma.tourRequest.findUnique({ where: { id }, include: detailInclude });
  },

  findByBookingReference(bookingReference: string) {
    return prisma.tourRequest.findUnique({
      where: { bookingReference },
      include: detailInclude,
    });
  },

  update(id: string, data: Prisma.TourRequestUpdateInput) {
    return prisma.tourRequest.update({ where: { id }, data, include: detailInclude });
  },

  async list(params: {
    status?: TourRequestStatus;
    search?: string;
    page: number;
    pageSize: number;
  }) {
    const { status, search, page, pageSize } = params;

    const where: Prisma.TourRequestWhereInput = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { bookingReference: { contains: search, mode: "insensitive" } },
              { customer: { fullName: { contains: search, mode: "insensitive" } } },
              { customer: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.tourRequest.findMany({
        where,
        include: detailInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.tourRequest.count({ where }),
    ]);

    return { items, total };
  },

  /** Requests assigned to a specific member — members never see others' tours. */
  listForMember(memberId: string) {
    return prisma.tourRequest.findMany({
      where: { assignment: { memberId } },
      include: detailInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  listRecent(limit: number) {
    return prisma.tourRequest.findMany({
      include: detailInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  listRecentlyAssigned(limit: number) {
    return prisma.tourRequest.findMany({
      where: { assignment: { isNot: null } },
      include: detailInclude,
      orderBy: { assignment: { assignedAt: "desc" } },
      take: limit,
    });
  },

  countByStatus(status: TourRequestStatus) {
    return prisma.tourRequest.count({ where: { status } });
  },

  countTotal() {
    return prisma.tourRequest.count();
  },
};
