import "dotenv/config";
import { PrismaClient, Role, AvailabilityStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * The package upserts below are idempotent on slug, but Prisma's nested
 * `locations: { create: [...] }` only runs on the `create` branch of an
 * upsert -- if the package already exists from an earlier seed run (e.g.
 * from before this schema had locations), its `update: {}` no-op branch
 * runs instead and locations are silently skipped. This backfills them
 * whenever a package has none yet.
 */
async function ensureLocations(
  packageId: string,
  existing: { id: string }[],
  locs: { name: string; description?: string; price: number; sortOrder: number }[]
) {
  if (existing.length > 0) return;
  await prisma.packageLocation.createMany({
    data: locs.map((l) => ({ ...l, packageId })),
  });
}

/**
 * The package upserts below are idempotent on slug, but Prisma's nested
 * `attributes: { create: [...] }` only runs on the `create` branch of an
 * upsert -- if the package already exists from an earlier seed run (e.g.
 * from before this schema had attributes), its `update: {}` no-op branch
 * runs instead and attributes are silently skipped. This backfills them
 * whenever a package has none yet.
 */
async function ensureAttributes(
  packageId: string,
  existing: { id: string }[],
  attrs: { name: string; description?: string; price: number; sortOrder: number }[]
) {
  if (existing.length > 0) return;
  await prisma.packageAttribute.createMany({
    data: attrs.map((a) => ({ ...a, packageId })),
  });
}

/**
 * Same backfill-if-empty logic as ensureAttributes for brand-new packages,
 * plus a by-name sync so fields added after the first seed run (like
 * starRating) get backfilled onto rows that already exist.
 */
async function ensureAccommodations(
  packageId: string,
  existing: { id: string; name: string }[],
  accs: {
    name: string;
    description?: string;
    image: string;
    starRating: number;
    price: number;
    sortOrder: number;
  }[]
) {
  if (existing.length === 0) {
    await prisma.packageAccommodation.createMany({
      data: accs.map((a) => ({ ...a, packageId })),
    });
    return;
  }

  for (const acc of accs) {
    const match = existing.find((e) => e.name === acc.name);
    if (match) {
      await prisma.packageAccommodation.update({
        where: { id: match.id },
        data: { starRating: acc.starRating },
      });
    }
  }
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@wayfare-tours.example" },
    update: {},
    create: {
      name: "Alex Morgan",
      email: "admin@wayfare-tours.example",
      passwordHash,
      role: Role.ADMIN,
      phone: "+1 555 010 0001",
    },
  });

  const guide1 = await prisma.user.upsert({
    where: { email: "sam.guide@wayfare-tours.example" },
    update: {},
    create: {
      name: "Sam Rivera",
      email: "sam.guide@wayfare-tours.example",
      passwordHash,
      role: Role.MEMBER,
      phone: "+1 555 010 0002",
      languages: ["English", "Spanish"],
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    },
  });

  await prisma.user.upsert({
    where: { email: "priya.guide@wayfare-tours.example" },
    update: {},
    create: {
      name: "Priya Nair",
      email: "priya.guide@wayfare-tours.example",
      passwordHash,
      role: Role.MEMBER,
      phone: "+1 555 010 0003",
      languages: ["English", "Hindi"],
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    },
  });

  const baliPkg = await prisma.tourPackage.upsert({
    where: { slug: "bali-highlights" },
    update: { coverImage: "https://picsum.photos/seed/bali-highlights/800/600" },
    create: {
      name: "Bali Highlights",
      slug: "bali-highlights",
      description:
        "Five days through Bali's rice terraces, temples, and beaches, with a private guide arranging every detail.",
      durationDays: 5,
      currency: "USD",
      includedServices: ["Private guide", "Airport transfers", "4-star hotel", "Daily breakfast"],
      excludedServices: ["International flights", "Travel insurance"],
      isActive: true,
      coverImage: "https://picsum.photos/seed/bali-highlights/800/600",
      locations: {
        create: [
          {
            name: "Ubud Rice Terraces",
            description: "Guided walk through the Tegallalang rice terraces.",
            price: 450,
            sortOrder: 0,
          },
          {
            name: "Tanah Lot Temple",
            description: "Sunset visit to the iconic sea temple.",
            price: 380,
            sortOrder: 1,
          },
          {
            name: "Seminyak Beach Day",
            description: "Beach club access and free time in Seminyak.",
            price: 460,
            sortOrder: 2,
          },
        ],
      },
      attributes: {
        create: [
          {
            name: "Sunrise trek to Mount Batur",
            description: "Early-morning guided hike with breakfast at the summit.",
            price: 85,
            sortOrder: 0,
          },
          {
            name: "Private cooking class",
            description: "Hands-on Balinese cooking class with a local chef.",
            price: 45,
            sortOrder: 1,
          },
          {
            name: "Uluwatu sunset & Kecak fire dance",
            price: 35,
            sortOrder: 2,
          },
        ],
      },
      accommodations: {
        create: [
          {
            name: "Ubud Standard Bungalow",
            description: "Cozy bungalow surrounded by rice terraces.",
            image: "https://picsum.photos/seed/bali-acc-standard/600/450",
            starRating: 3,
            price: 0,
            sortOrder: 0,
          },
          {
            name: "Seminyak Deluxe Resort",
            description: "Beachside resort with pool access.",
            image: "https://picsum.photos/seed/bali-acc-deluxe/600/450",
            starRating: 4,
            price: 120,
            sortOrder: 1,
          },
          {
            name: "Uluwatu Cliffside Villa",
            description: "Private villa with an ocean-view infinity pool.",
            image: "https://picsum.photos/seed/bali-acc-luxury/600/450",
            starRating: 5,
            price: 280,
            sortOrder: 2,
          },
        ],
      },
    },
    include: { locations: true, attributes: true, accommodations: true },
  });

  await ensureLocations(baliPkg.id, baliPkg.locations, [
    {
      name: "Ubud Rice Terraces",
      description: "Guided walk through the Tegallalang rice terraces.",
      price: 450,
      sortOrder: 0,
    },
    {
      name: "Tanah Lot Temple",
      description: "Sunset visit to the iconic sea temple.",
      price: 380,
      sortOrder: 1,
    },
    {
      name: "Seminyak Beach Day",
      description: "Beach club access and free time in Seminyak.",
      price: 460,
      sortOrder: 2,
    },
  ]);
  if (baliPkg.locations.length === 0) {
    baliPkg.locations = await prisma.packageLocation.findMany({ where: { packageId: baliPkg.id } });
  }

  await ensureAttributes(baliPkg.id, baliPkg.attributes, [
    {
      name: "Sunrise trek to Mount Batur",
      description: "Early-morning guided hike with breakfast at the summit.",
      price: 85,
      sortOrder: 0,
    },
    {
      name: "Private cooking class",
      description: "Hands-on Balinese cooking class with a local chef.",
      price: 45,
      sortOrder: 1,
    },
    { name: "Uluwatu sunset & Kecak fire dance", price: 35, sortOrder: 2 },
  ]);
  if (baliPkg.attributes.length === 0) {
    baliPkg.attributes = await prisma.packageAttribute.findMany({ where: { packageId: baliPkg.id } });
  }

  await ensureAccommodations(baliPkg.id, baliPkg.accommodations, [
    {
      name: "Ubud Standard Bungalow",
      description: "Cozy bungalow surrounded by rice terraces.",
      image: "https://picsum.photos/seed/bali-acc-standard/600/450",
      starRating: 3,
      price: 0,
      sortOrder: 0,
    },
    {
      name: "Seminyak Deluxe Resort",
      description: "Beachside resort with pool access.",
      image: "https://picsum.photos/seed/bali-acc-deluxe/600/450",
      starRating: 4,
      price: 120,
      sortOrder: 1,
    },
    {
      name: "Uluwatu Cliffside Villa",
      description: "Private villa with an ocean-view infinity pool.",
      image: "https://picsum.photos/seed/bali-acc-luxury/600/450",
      starRating: 5,
      price: 280,
      sortOrder: 2,
    },
  ]);
  if (baliPkg.accommodations.length === 0) {
    baliPkg.accommodations = await prisma.packageAccommodation.findMany({ where: { packageId: baliPkg.id } });
  }

  const trekPkg = await prisma.tourPackage.upsert({
    where: { slug: "peruvian-andes-trek" },
    update: { coverImage: "https://picsum.photos/seed/peruvian-andes-trek/800/600" },
    create: {
      name: "Peruvian Andes Trek",
      slug: "peruvian-andes-trek",
      description:
        "A seven-day trek through the Andes to Machu Picchu, with acclimatization days and a small-group guide.",
      durationDays: 7,
      currency: "USD",
      includedServices: ["Trekking guide", "Camping equipment", "All meals on trail"],
      excludedServices: ["Flights to Cusco", "Personal gear"],
      isActive: true,
      coverImage: "https://picsum.photos/seed/peruvian-andes-trek/800/600",
      locations: {
        create: [
          {
            name: "Sacred Valley Ruins",
            description: "Guided tour of the Pisac and Ollantaytambo ruins.",
            price: 700,
            sortOrder: 0,
          },
          {
            name: "Ollantaytambo Fortress",
            description: "Exploration of the Inca fortress and terraces.",
            price: 650,
            sortOrder: 1,
          },
          {
            name: "Machu Picchu Sanctuary",
            description: "Full-day guided entry to the Machu Picchu sanctuary.",
            price: 800,
            sortOrder: 2,
          },
        ],
      },
      attributes: {
        create: [
          {
            name: "Extra acclimatization day in Cusco",
            price: 60,
            sortOrder: 0,
          },
          {
            name: "Private porter for personal gear",
            price: 120,
            sortOrder: 1,
          },
        ],
      },
      accommodations: {
        create: [
          {
            name: "Cusco Standard Guesthouse",
            description: "Simple, comfortable guesthouse in central Cusco.",
            image: "https://picsum.photos/seed/trek-acc-standard/600/450",
            starRating: 3,
            price: 0,
            sortOrder: 0,
          },
          {
            name: "Sacred Valley Lodge",
            description: "Mountain lodge with heated rooms and valley views.",
            image: "https://picsum.photos/seed/trek-acc-deluxe/600/450",
            starRating: 4,
            price: 150,
            sortOrder: 1,
          },
          {
            name: "Machu Picchu Luxury Retreat",
            description: "Premium eco-lodge steps from the sanctuary gate.",
            image: "https://picsum.photos/seed/trek-acc-luxury/600/450",
            starRating: 5,
            price: 340,
            sortOrder: 2,
          },
        ],
      },
    },
    include: { locations: true, attributes: true, accommodations: true },
  });

  await ensureLocations(trekPkg.id, trekPkg.locations, [
    {
      name: "Sacred Valley Ruins",
      description: "Guided tour of the Pisac and Ollantaytambo ruins.",
      price: 700,
      sortOrder: 0,
    },
    {
      name: "Ollantaytambo Fortress",
      description: "Exploration of the Inca fortress and terraces.",
      price: 650,
      sortOrder: 1,
    },
    {
      name: "Machu Picchu Sanctuary",
      description: "Full-day guided entry to the Machu Picchu sanctuary.",
      price: 800,
      sortOrder: 2,
    },
  ]);
  if (trekPkg.locations.length === 0) {
    trekPkg.locations = await prisma.packageLocation.findMany({ where: { packageId: trekPkg.id } });
  }

  await ensureAttributes(trekPkg.id, trekPkg.attributes, [
    { name: "Extra acclimatization day in Cusco", price: 60, sortOrder: 0 },
    { name: "Private porter for personal gear", price: 120, sortOrder: 1 },
  ]);
  if (trekPkg.attributes.length === 0) {
    trekPkg.attributes = await prisma.packageAttribute.findMany({ where: { packageId: trekPkg.id } });
  }

  await ensureAccommodations(trekPkg.id, trekPkg.accommodations, [
    {
      name: "Cusco Standard Guesthouse",
      description: "Simple, comfortable guesthouse in central Cusco.",
      image: "https://picsum.photos/seed/trek-acc-standard/600/450",
      starRating: 3,
      price: 0,
      sortOrder: 0,
    },
    {
      name: "Sacred Valley Lodge",
      description: "Mountain lodge with heated rooms and valley views.",
      image: "https://picsum.photos/seed/trek-acc-deluxe/600/450",
      starRating: 4,
      price: 150,
      sortOrder: 1,
    },
    {
      name: "Machu Picchu Luxury Retreat",
      description: "Premium eco-lodge steps from the sanctuary gate.",
      image: "https://picsum.photos/seed/trek-acc-luxury/600/450",
      starRating: 5,
      price: 340,
      sortOrder: 2,
    },
  ]);
  if (trekPkg.accommodations.length === 0) {
    trekPkg.accommodations = await prisma.packageAccommodation.findMany({ where: { packageId: trekPkg.id } });
  }

  const customer = await prisma.customer.upsert({
    where: { email: "jamie.traveler@example.com" },
    update: {},
    create: {
      fullName: "Jamie Traveler",
      email: "jamie.traveler@example.com",
      phone: "+1 555 200 3000",
      country: "United States",
    },
  });

  const existingRequest = await prisma.tourRequest.findUnique({
    where: { bookingReference: "TRK-DEMO-0001" },
  });

  if (!existingRequest) {
    const sunriseTrek = baliPkg.attributes.find((a) => a.name === "Sunrise trek to Mount Batur")!;
    const baliAccommodation = baliPkg.accommodations.find((a) => a.name === "Seminyak Deluxe Resort")!;
    const trekAccommodation = trekPkg.accommodations.find((a) => a.name === "Sacred Valley Lodge")!;
    const baliLocationsTotal = baliPkg.locations.reduce((sum, l) => sum + Number(l.price), 0);
    const trekLocationsTotal = trekPkg.locations.reduce((sum, l) => sum + Number(l.price), 0);
    const baliPriceAtBooking =
      baliLocationsTotal + Number(sunriseTrek.price) + Number(baliAccommodation.price);
    const trekPriceAtBooking = trekLocationsTotal + Number(trekAccommodation.price);

    const request = await prisma.tourRequest.create({
      data: {
        bookingReference: "TRK-DEMO-0001",
        customerId: customer.id,
        estimatedTotal: baliPriceAtBooking + trekPriceAtBooking,
        packages: {
          create: [
            {
              packageId: baliPkg.id,
              accommodationId: baliAccommodation.id,
              accommodationPriceAtBooking: baliAccommodation.price,
              priceAtBooking: baliPriceAtBooking,
              locations: {
                create: baliPkg.locations.map((loc) => ({
                  packageLocationId: loc.id,
                  priceAtBooking: loc.price,
                })),
              },
              attributes: {
                create: [{ packageAttributeId: sunriseTrek.id, priceAtBooking: sunriseTrek.price }],
              },
            },
            {
              packageId: trekPkg.id,
              accommodationId: trekAccommodation.id,
              accommodationPriceAtBooking: trekAccommodation.price,
              priceAtBooking: trekPriceAtBooking,
              locations: {
                create: trekPkg.locations.map((loc) => ({
                  packageLocationId: loc.id,
                  priceAtBooking: loc.price,
                })),
              },
            },
          ],
        },
        travelDateStart: new Date(new Date().getFullYear() + 1, 5, 1),
        numberOfTravelers: 2,
        preferredDestinations: ["Ubud", "Seminyak"],
        activities: ["Hiking", "Snorkeling"],
        status: "ASSIGNED",
      },
    });

    await prisma.assignment.create({
      data: {
        tourRequestId: request.id,
        memberId: guide1.id,
        assignedById: admin.id,
        memberStatus: "ACCEPTED",
      },
    });
  }

  console.log("Seed complete.");
  console.log("Admin login:  admin@wayfare-tours.example / password123");
  console.log("Guide login:  sam.guide@wayfare-tours.example / password123");
  console.log("Guide login:  priya.guide@wayfare-tours.example / password123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
