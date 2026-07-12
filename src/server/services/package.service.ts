import { packageRepository } from "@/server/repositories/package.repository";
import { packageLocationRepository } from "@/server/repositories/package-location.repository";
import { packageAttributeRepository } from "@/server/repositories/package-attribute.repository";
import { packageAccommodationRepository } from "@/server/repositories/package-accommodation.repository";
import { ConflictError, NotFoundError } from "@/server/lib/errors";
import type {
  CreatePackageInput,
  PackageAccommodationInput,
  PackageAttributeInput,
  PackageLocationInput,
  UpdatePackageInput,
} from "@/server/dto/package.dto";
import type { PackageAccommodation, PackageAttribute, PackageLocation } from "@prisma/client";

/**
 * Same create/update/soft-disable diffing as syncAttributes, but for a
 * package's itinerary locations. A location already selected on a submitted
 * tour request can't be hard-deleted (FK restrict) — soft-disabled instead.
 */
async function syncLocations(packageId: string, existing: PackageLocation[], incoming: PackageLocationInput[]) {
  const incomingIds = new Set(incoming.filter((l) => l.id).map((l) => l.id));

  for (const loc of existing) {
    if (!incomingIds.has(loc.id)) {
      try {
        await packageLocationRepository.delete(loc.id);
      } catch {
        await packageLocationRepository.update(loc.id, { isActive: false });
      }
    }
  }

  for (const [index, loc] of incoming.entries()) {
    const data = {
      name: loc.name,
      description: loc.description || null,
      price: loc.price,
      isActive: loc.isActive,
      sortOrder: index,
    };
    if (loc.id) {
      await packageLocationRepository.update(loc.id, data);
    } else {
      await packageLocationRepository.create({ ...data, package: { connect: { id: packageId } } });
    }
  }
}

/**
 * Diffs the incoming attribute list against what's currently stored: updates
 * matches by id, creates entries with no id, and removes anything no longer
 * present. An attribute already selected on a submitted tour request can't be
 * hard-deleted (FK restrict) — in that case it's soft-disabled instead, so
 * past bookings keep an accurate historical record.
 */
async function syncAttributes(packageId: string, existing: PackageAttribute[], incoming: PackageAttributeInput[]) {
  const incomingIds = new Set(incoming.filter((a) => a.id).map((a) => a.id));

  for (const attr of existing) {
    if (!incomingIds.has(attr.id)) {
      try {
        await packageAttributeRepository.delete(attr.id);
      } catch {
        await packageAttributeRepository.update(attr.id, { isActive: false });
      }
    }
  }

  for (const [index, attr] of incoming.entries()) {
    const data = {
      name: attr.name,
      description: attr.description || null,
      price: attr.price,
      isActive: attr.isActive,
      sortOrder: index,
    };
    if (attr.id) {
      await packageAttributeRepository.update(attr.id, data);
    } else {
      await packageAttributeRepository.create({ ...data, package: { connect: { id: packageId } } });
    }
  }
}

/**
 * Same create/update/soft-disable diffing as syncAttributes, but for the
 * per-package accommodation (hotel) options customers pick one of.
 */
async function syncAccommodations(
  packageId: string,
  existing: PackageAccommodation[],
  incoming: PackageAccommodationInput[]
) {
  const incomingIds = new Set(incoming.filter((a) => a.id).map((a) => a.id));

  for (const acc of existing) {
    if (!incomingIds.has(acc.id)) {
      try {
        await packageAccommodationRepository.delete(acc.id);
      } catch {
        await packageAccommodationRepository.update(acc.id, { isActive: false });
      }
    }
  }

  for (const [index, acc] of incoming.entries()) {
    const data = {
      name: acc.name,
      description: acc.description || null,
      image: acc.image || null,
      starRating: acc.starRating,
      price: acc.price,
      isActive: acc.isActive,
      sortOrder: index,
    };
    if (acc.id) {
      await packageAccommodationRepository.update(acc.id, data);
    } else {
      await packageAccommodationRepository.create({ ...data, package: { connect: { id: packageId } } });
    }
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "package";
  let candidate = base;
  let suffix = 1;

  // Guards against two packages named identically ("Bali Adventure" twice).
  for (;;) {
    const existing = await packageRepository.findBySlug(candidate);
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

export const packageService = {
  listPublic() {
    return packageRepository.list({ onlyActive: true });
  },

  listAll() {
    return packageRepository.list({});
  },

  async getBySlug(slug: string) {
    const pkg = await packageRepository.findBySlug(slug);
    if (!pkg || !pkg.isActive) throw new NotFoundError("Tour package");
    return pkg;
  },

  async getById(id: string) {
    const pkg = await packageRepository.findById(id);
    if (!pkg) throw new NotFoundError("Tour package");
    return pkg;
  },

  async create(input: CreatePackageInput) {
    const slug = await uniqueSlug(input.name);
    return packageRepository.create({
      name: input.name,
      slug,
      description: input.description,
      durationDays: input.durationDays,
      currency: input.currency,
      coverImage: input.coverImage || null,
      galleryImages: input.galleryImages,
      includedServices: input.includedServices,
      excludedServices: input.excludedServices,
      isActive: input.isActive,
      locations: {
        create: input.locations.map((loc, index) => ({
          name: loc.name,
          description: loc.description || null,
          price: loc.price,
          isActive: loc.isActive,
          sortOrder: index,
        })),
      },
      attributes: {
        create: input.attributes.map((attr, index) => ({
          name: attr.name,
          description: attr.description || null,
          price: attr.price,
          isActive: attr.isActive,
          sortOrder: index,
        })),
      },
      accommodations: {
        create: input.accommodations.map((acc, index) => ({
          name: acc.name,
          description: acc.description || null,
          image: acc.image || null,
          starRating: acc.starRating,
          price: acc.price,
          isActive: acc.isActive,
          sortOrder: index,
        })),
      },
    });
  },

  async update(id: string, input: UpdatePackageInput) {
    const existing = await packageRepository.findById(id);
    if (!existing) throw new NotFoundError("Tour package");

    const slug = input.name && input.name !== existing.name
      ? await uniqueSlug(input.name, id)
      : undefined;

    await packageRepository.update(id, {
      ...(input.name ? { name: input.name } : {}),
      ...(slug ? { slug } : {}),
      ...(input.description ? { description: input.description } : {}),
      ...(input.durationDays !== undefined ? { durationDays: input.durationDays } : {}),
      ...(input.currency ? { currency: input.currency } : {}),
      ...(input.coverImage !== undefined ? { coverImage: input.coverImage || null } : {}),
      ...(input.galleryImages ? { galleryImages: input.galleryImages } : {}),
      ...(input.includedServices ? { includedServices: input.includedServices } : {}),
      ...(input.excludedServices ? { excludedServices: input.excludedServices } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    });

    if (input.locations) {
      await syncLocations(id, existing.locations, input.locations);
    }

    if (input.attributes) {
      await syncAttributes(id, existing.attributes, input.attributes);
    }

    if (input.accommodations) {
      await syncAccommodations(id, existing.accommodations, input.accommodations);
    }

    const result = await packageRepository.findById(id);
    if (!result) throw new NotFoundError("Tour package");
    return result;
  },

  async delete(id: string) {
    const existing = await packageRepository.findById(id);
    if (!existing) throw new NotFoundError("Tour package");
    try {
      await packageRepository.delete(id);
    } catch {
      // A package referenced by any submitted tour request can't be hard
      // deleted (FK restrict) — surface a clean error instead of a raw
      // Prisma exception.
      throw new ConflictError("This package could not be deleted");
    }
  },
};
