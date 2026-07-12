import { prisma } from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const packageLocationRepository = {
  create(data: Prisma.PackageLocationCreateInput) {
    return prisma.packageLocation.create({ data });
  },

  update(id: string, data: Prisma.PackageLocationUpdateInput) {
    return prisma.packageLocation.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.packageLocation.delete({ where: { id } });
  },
};
