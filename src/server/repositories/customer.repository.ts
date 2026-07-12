import { prisma } from "@/server/lib/prisma";

export const customerRepository = {
  findByEmail(email: string) {
    return prisma.customer.findUnique({ where: { email } });
  },

  /**
   * Repeat customers are deduplicated by email. New submissions refresh
   * the stored name/phone/country in case the customer's details changed.
   */
  async findOrCreate(data: { fullName: string; email: string; phone: string; country?: string }) {
    return prisma.customer.upsert({
      where: { email: data.email },
      update: {
        fullName: data.fullName,
        phone: data.phone,
        country: data.country,
      },
      create: data,
    });
  },
};
