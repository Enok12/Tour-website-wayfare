import { prisma } from "@/server/lib/prisma";
import { MemberTourStatus } from "@prisma/client";

export const assignmentRepository = {
  findByTourRequestId(tourRequestId: string) {
    return prisma.assignment.findUnique({ where: { tourRequestId } });
  },

  /**
   * Assign or reassign a member to a request. Modeled as an upsert since a
   * request has at most one *current* assignment (history could later be
   * tracked in a separate audit table without changing this API).
   */
  upsert(params: { tourRequestId: string; memberId: string; assignedById: string }) {
    const { tourRequestId, memberId, assignedById } = params;
    return prisma.assignment.upsert({
      where: { tourRequestId },
      update: { memberId, assignedById, memberStatus: null },
      create: { tourRequestId, memberId, assignedById },
    });
  },

  updateMemberStatus(tourRequestId: string, memberStatus: MemberTourStatus) {
    return prisma.assignment.update({
      where: { tourRequestId },
      data: { memberStatus },
    });
  },
};
