import { prisma } from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

const attributesInclude = {
  locations: { orderBy: { sortOrder: "asc" } },
  attributes: { orderBy: { sortOrder: "asc" } },
  accommodations: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.TourPackageInclude;

export const packageRepository = {
  findById(id: string) {
    return prisma.tourPackage.findUnique({ where: { id }, include: attributesInclude });
  },

  findBySlug(slug: string) {
    return prisma.tourPackage.findUnique({ where: { slug }, include: attributesInclude });
  },

  findManyByIds(ids: string[]) {
    return prisma.tourPackage.findMany({ where: { id: { in: ids } }, include: attributesInclude });
  },

  list(params: { onlyActive?: boolean } = {}) {
    return prisma.tourPackage.findMany({
      where: params.onlyActive ? { isActive: true } : {},
      include: attributesInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: Prisma.TourPackageCreateInput) {
    return prisma.tourPackage.create({ data, include: attributesInclude });
  },

  update(id: string, data: Prisma.TourPackageUpdateInput) {
    return prisma.tourPackage.update({ where: { id }, data, include: attributesInclude });
  },

  delete(id: string) {
    return prisma.tourPackage.delete({ where: { id } });
  },

  countActive() {
    return prisma.tourPackage.count({ where: { isActive: true } });
  },
};
