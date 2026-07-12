import { prisma } from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const packageAccommodationRepository = {
  create(data: Prisma.PackageAccommodationCreateInput) {
    return prisma.packageAccommodation.create({ data });
  },

  update(id: string, data: Prisma.PackageAccommodationUpdateInput) {
    return prisma.packageAccommodation.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.packageAccommodation.delete({ where: { id } });
  },
};
