import { prisma } from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const activityLogRepository = {
  create(data: {
    userId?: string;
    action: string;
    entityType: string;
    entityId: string;
    tourRequestId?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.activityLog.create({ data });
  },

  listByEntity(entityType: string, entityId: string) {
    return prisma.activityLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: "desc" },
    });
  },
};
