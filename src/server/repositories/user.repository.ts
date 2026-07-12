import { prisma } from "@/server/lib/prisma";
import { Prisma, Role } from "@prisma/client";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  softDeactivate(id: string) {
    return prisma.user.update({ where: { id }, data: { isActive: false, availabilityStatus: "OFFLINE" } });
  },

  listMembers(params: { search?: string; onlyActive?: boolean } = {}) {
    const { search, onlyActive } = params;
    return prisma.user.findMany({
      where: {
        role: Role.MEMBER,
        ...(onlyActive ? { isActive: true } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  },

  listAvailableMembers() {
    return prisma.user.findMany({
      where: { role: Role.MEMBER, isActive: true, availabilityStatus: "AVAILABLE" },
      orderBy: { name: "asc" },
    });
  },

  countMembers(onlyAvailable = false) {
    return prisma.user.count({
      where: {
        role: Role.MEMBER,
        isActive: true,
        ...(onlyAvailable ? { availabilityStatus: "AVAILABLE" } : {}),
      },
    });
  },
};
