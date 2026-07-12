import { prisma } from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const packageAttributeRepository = {
  create(data: Prisma.PackageAttributeCreateInput) {
    return prisma.packageAttribute.create({ data });
  },

  update(id: string, data: Prisma.PackageAttributeUpdateInput) {
    return prisma.packageAttribute.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.packageAttribute.delete({ where: { id } });
  },
};
