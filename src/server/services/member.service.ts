import { userRepository } from "@/server/repositories/user.repository";
import { hashPassword } from "@/server/lib/password";
import { ConflictError, NotFoundError } from "@/server/lib/errors";
import { Role, type User } from "@prisma/client";
import type { CreateMemberInput, UpdateMemberInput } from "@/server/dto/member.dto";

type PublicMember = Omit<User, "passwordHash">;

function toPublic(user: User): PublicMember {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export const memberService = {
  async list(search?: string) {
    const members = await userRepository.listMembers({ search });
    return members.map(toPublic);
  },

  async getById(id: string) {
    const member = await userRepository.findById(id);
    if (!member || member.role !== Role.MEMBER) throw new NotFoundError("Member");
    return toPublic(member);
  },

  async create(input: CreateMemberInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError("A user with this email already exists");

    const passwordHash = await hashPassword(input.password);
    const member = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      role: Role.MEMBER,
      profileImage: input.profileImage || null,
      languages: input.languages,
      availabilityStatus: input.availabilityStatus,
    });
    return toPublic(member);
  },

  async update(id: string, input: UpdateMemberInput) {
    const existing = await userRepository.findById(id);
    if (!existing || existing.role !== Role.MEMBER) throw new NotFoundError("Member");

    const passwordHash = input.password ? await hashPassword(input.password) : undefined;

    const updated = await userRepository.update(id, {
      ...(input.name ? { name: input.name } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.profileImage !== undefined ? { profileImage: input.profileImage || null } : {}),
      ...(input.languages ? { languages: input.languages } : {}),
      ...(input.availabilityStatus ? { availabilityStatus: input.availabilityStatus } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(passwordHash ? { passwordHash } : {}),
    });
    return toPublic(updated);
  },

  async deactivate(id: string) {
    const existing = await userRepository.findById(id);
    if (!existing || existing.role !== Role.MEMBER) throw new NotFoundError("Member");
    const updated = await userRepository.softDeactivate(id);
    return toPublic(updated);
  },

  async listAvailable() {
    const members = await userRepository.listAvailableMembers();
    return members.map(toPublic);
  },
};
