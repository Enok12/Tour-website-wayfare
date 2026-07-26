import "dotenv/config";
import { PrismaClient, Role, AvailabilityStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface LocationSeed {
  name: string;
  description?: string;
  price: number;
}

interface AttributeSeed {
  name: string;
  description?: string;
  price: number;
}

interface AccommodationSeed {
  name: string;
  description?: string;
  image: string;
  starRating: number;
  price: number;
}

interface PackageSeed {
  slug: string;
  name: string;
  description: string;
  durationDays: number;
  includedServices: string[];
  excludedServices: string[];
  coverImage: string;
  galleryImages: string[];
  locations: LocationSeed[];
  attributes: AttributeSeed[];
  accommodations: AccommodationSeed[];
}

/**
 * Upserts a package by slug and makes sure its locations/attributes/
 * accommodations exist -- both on first creation (nested `create`, which
 * only runs on the upsert's `create` branch) and on repeat seed runs against
 * a package that already exists from before this field existed, where the
 * `update: {}` no-op branch would otherwise silently skip them.
 */
async function seedPackage(def: PackageSeed) {
  const withSortOrder = <T>(items: T[]) => items.map((item, sortOrder) => ({ ...item, sortOrder }));

  const pkg = await prisma.tourPackage.upsert({
    where: { slug: def.slug },
    update: { coverImage: def.coverImage, galleryImages: def.galleryImages },
    create: {
      name: def.name,
      slug: def.slug,
      description: def.description,
      durationDays: def.durationDays,
      currency: "USD",
      includedServices: def.includedServices,
      excludedServices: def.excludedServices,
      isActive: true,
      coverImage: def.coverImage,
      galleryImages: def.galleryImages,
      locations: { create: withSortOrder(def.locations) },
      attributes: { create: withSortOrder(def.attributes) },
      accommodations: { create: withSortOrder(def.accommodations) },
    },
    include: { locations: true, attributes: true, accommodations: true },
  });

  if (pkg.locations.length === 0) {
    await prisma.packageLocation.createMany({
      data: withSortOrder(def.locations).map((l) => ({ ...l, packageId: pkg.id })),
    });
    pkg.locations = await prisma.packageLocation.findMany({ where: { packageId: pkg.id } });
  }

  if (pkg.attributes.length === 0) {
    await prisma.packageAttribute.createMany({
      data: withSortOrder(def.attributes).map((a) => ({ ...a, packageId: pkg.id })),
    });
    pkg.attributes = await prisma.packageAttribute.findMany({ where: { packageId: pkg.id } });
  }

  if (pkg.accommodations.length === 0) {
    await prisma.packageAccommodation.createMany({
      data: withSortOrder(def.accommodations).map((a) => ({ ...a, packageId: pkg.id })),
    });
    pkg.accommodations = await prisma.packageAccommodation.findMany({ where: { packageId: pkg.id } });
  } else {
    // Backfill starRating (or other newly-added fields) onto rows that
    // already existed from an earlier seed run, matched by name.
    for (const acc of def.accommodations) {
      const match = pkg.accommodations.find((e) => e.name === acc.name);
      if (match) {
        await prisma.packageAccommodation.update({ where: { id: match.id }, data: { starRating: acc.starRating } });
      }
    }
  }

  return pkg;
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

  const baliPkg = await seedPackage({
    slug: "bali-highlights",
    name: "Bali Highlights",
    description:
      "Five days through Bali's rice terraces, temples, and beaches, with a private guide arranging every detail.",
    durationDays: 5,
    includedServices: ["Private guide", "Airport transfers", "4-star hotel", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance"],
    coverImage: "https://picsum.photos/seed/bali-highlights/800/600",
    galleryImages: [
      "https://picsum.photos/seed/bali-gallery-1/600/600",
      "https://picsum.photos/seed/bali-gallery-2/600/600",
      "https://picsum.photos/seed/bali-gallery-3/600/600",
      "https://picsum.photos/seed/bali-gallery-4/600/600",
    ],
    locations: [
      { name: "Ubud Rice Terraces", description: "Guided walk through the Tegallalang rice terraces.", price: 450 },
      { name: "Tanah Lot Temple", description: "Sunset visit to the iconic sea temple.", price: 380 },
      { name: "Seminyak Beach Day", description: "Beach club access and free time in Seminyak.", price: 460 },
    ],
    attributes: [
      {
        name: "Sunrise trek to Mount Batur",
        description: "Early-morning guided hike with breakfast at the summit.",
        price: 85,
      },
      { name: "Private cooking class", description: "Hands-on Balinese cooking class with a local chef.", price: 45 },
      { name: "Uluwatu sunset & Kecak fire dance", price: 35 },
    ],
    accommodations: [
      {
        name: "Ubud Standard Bungalow",
        description: "Cozy bungalow surrounded by rice terraces.",
        image: "https://picsum.photos/seed/bali-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Seminyak Deluxe Resort",
        description: "Beachside resort with pool access.",
        image: "https://picsum.photos/seed/bali-acc-deluxe/600/450",
        starRating: 4,
        price: 120,
      },
      {
        name: "Uluwatu Cliffside Villa",
        description: "Private villa with an ocean-view infinity pool.",
        image: "https://picsum.photos/seed/bali-acc-luxury/600/450",
        starRating: 5,
        price: 280,
      },
    ],
  });

  const trekPkg = await seedPackage({
    slug: "peruvian-andes-trek",
    name: "Peruvian Andes Trek",
    description:
      "A seven-day trek through the Andes to Machu Picchu, with acclimatization days and a small-group guide.",
    durationDays: 7,
    includedServices: ["Trekking guide", "Camping equipment", "All meals on trail"],
    excludedServices: ["Flights to Cusco", "Personal gear"],
    coverImage: "https://picsum.photos/seed/peruvian-andes-trek/800/600",
    galleryImages: [
      "https://picsum.photos/seed/trek-gallery-1/600/600",
      "https://picsum.photos/seed/trek-gallery-2/600/600",
      "https://picsum.photos/seed/trek-gallery-3/600/600",
      "https://picsum.photos/seed/trek-gallery-4/600/600",
    ],
    locations: [
      { name: "Sacred Valley Ruins", description: "Guided tour of the Pisac and Ollantaytambo ruins.", price: 700 },
      { name: "Ollantaytambo Fortress", description: "Exploration of the Inca fortress and terraces.", price: 650 },
      {
        name: "Machu Picchu Sanctuary",
        description: "Full-day guided entry to the Machu Picchu sanctuary.",
        price: 800,
      },
    ],
    attributes: [
      { name: "Extra acclimatization day in Cusco", price: 60 },
      { name: "Private porter for personal gear", price: 120 },
    ],
    accommodations: [
      {
        name: "Cusco Standard Guesthouse",
        description: "Simple, comfortable guesthouse in central Cusco.",
        image: "https://picsum.photos/seed/trek-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Sacred Valley Lodge",
        description: "Mountain lodge with heated rooms and valley views.",
        image: "https://picsum.photos/seed/trek-acc-deluxe/600/450",
        starRating: 4,
        price: 150,
      },
      {
        name: "Machu Picchu Luxury Retreat",
        description: "Premium eco-lodge steps from the sanctuary gate.",
        image: "https://picsum.photos/seed/trek-acc-luxury/600/450",
        starRating: 5,
        price: 340,
      },
    ],
  });

  await seedPackage({
    slug: "kandy-cultural-journey",
    name: "Kandy Cultural Journey",
    description:
      "Four days in Sri Lanka's cultural heart, from the Temple of the Tooth to the tea hills above Nuwara Eliya.",
    durationDays: 4,
    includedServices: ["Private chauffeur guide", "Airport transfers", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance"],
    coverImage: "https://picsum.photos/seed/kandy-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/kandy-gallery-1/600/600",
      "https://picsum.photos/seed/kandy-gallery-2/600/600",
      "https://picsum.photos/seed/kandy-gallery-3/600/600",
      "https://picsum.photos/seed/kandy-gallery-4/600/600",
    ],
    locations: [
      {
        name: "Temple of the Sacred Tooth Relic",
        description: "Guided visit to Sri Lanka's most revered Buddhist shrine.",
        price: 320,
      },
      { name: "Kandy Lake Promenade", description: "Sunset walk around the historic lake.", price: 180 },
      {
        name: "Royal Botanical Gardens, Peradeniya",
        description: "Guided tour of the sprawling botanical gardens.",
        price: 220,
      },
    ],
    attributes: [
      {
        name: "Kandyan Cultural Dance Show",
        description: "Evening performance of traditional Kandyan drumming and fire dancing.",
        price: 40,
      },
      { name: "Nuwara Eliya tea plantation visit", description: "Guided tour of a working tea estate.", price: 65 },
    ],
    accommodations: [
      {
        name: "Kandy City Inn",
        description: "Simple, central guesthouse a short walk from the temple.",
        image: "https://picsum.photos/seed/kandy-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Kandy Lake Resort",
        description: "Comfortable hotel with lake views and a pool.",
        image: "https://picsum.photos/seed/kandy-acc-deluxe/600/450",
        starRating: 4,
        price: 95,
      },
      {
        name: "Kandy Hills Sanctuary",
        description: "Hillside luxury retreat overlooking the valley.",
        image: "https://picsum.photos/seed/kandy-acc-luxury/600/450",
        starRating: 5,
        price: 210,
      },
    ],
  });

  await seedPackage({
    slug: "tuscany-wine-hill-towns",
    name: "Tuscany Wine & Hill Towns",
    description: "Six days through Florence, medieval hill towns, and the vineyards of Chianti.",
    durationDays: 6,
    includedServices: ["Private driver-guide", "Airport transfers", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance", "Lunches and dinners"],
    coverImage: "https://picsum.photos/seed/tuscany-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/tuscany-gallery-1/600/600",
      "https://picsum.photos/seed/tuscany-gallery-2/600/600",
      "https://picsum.photos/seed/tuscany-gallery-3/600/600",
      "https://picsum.photos/seed/tuscany-gallery-4/600/600",
    ],
    locations: [
      { name: "Florence Old Town", description: "Guided walk through the Duomo and Uffizi district.", price: 400 },
      { name: "San Gimignano Towers", description: "Half-day visit to the medieval tower town.", price: 280 },
      { name: "Chianti Vineyard Trail", description: "Scenic drive through the Chianti wine region.", price: 350 },
    ],
    attributes: [
      { name: "Private wine tasting & cellar tour", description: "Tasting at a family-run Chianti estate.", price: 90 },
      { name: "Tuscan cooking class", description: "Hands-on pasta and sauce-making class.", price: 75 },
    ],
    accommodations: [
      {
        name: "Countryside Agriturismo",
        description: "Simple working-farm stay in the Tuscan hills.",
        image: "https://picsum.photos/seed/tuscany-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Boutique Villa Chianti",
        description: "Restored villa with a pool, surrounded by vineyards.",
        image: "https://picsum.photos/seed/tuscany-acc-deluxe/600/450",
        starRating: 4,
        price: 160,
      },
      {
        name: "Historic Estate Suite",
        description: "Suite in a centuries-old wine estate.",
        image: "https://picsum.photos/seed/tuscany-acc-luxury/600/450",
        starRating: 5,
        price: 320,
      },
    ],
  });

  await seedPackage({
    slug: "moroccan-desert-expedition",
    name: "Moroccan Desert Expedition",
    description: "Eight days from Marrakech's medina, over the Atlas Mountains, to the dunes of the Sahara.",
    durationDays: 8,
    includedServices: ["4x4 driver-guide", "Desert camp transfers", "All meals in the desert"],
    excludedServices: ["International flights", "Travel insurance"],
    coverImage: "https://picsum.photos/seed/morocco-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/morocco-gallery-1/600/600",
      "https://picsum.photos/seed/morocco-gallery-2/600/600",
      "https://picsum.photos/seed/morocco-gallery-3/600/600",
      "https://picsum.photos/seed/morocco-gallery-4/600/600",
    ],
    locations: [
      { name: "Marrakech Medina", description: "Guided walk through the souks and Jemaa el-Fnaa.", price: 300 },
      { name: "Atlas Mountains Crossing", description: "Scenic drive over the High Atlas via Tizi n'Tichka.", price: 260 },
      { name: "Sahara Dunes at Merzouga", description: "Sunset camel trek into the Erg Chebbi dunes.", price: 480 },
    ],
    attributes: [
      { name: "Sunset camel trek", description: "Extended camel excursion with a private guide.", price: 70 },
      { name: "Traditional hammam spa experience", description: "Full hammam and massage session.", price: 55 },
    ],
    accommodations: [
      {
        name: "Riad Standard Room",
        description: "Traditional riad courtyard room in the medina.",
        image: "https://picsum.photos/seed/morocco-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Desert Boutique Camp",
        description: "En-suite tents with a shared lounge under the stars.",
        image: "https://picsum.photos/seed/morocco-acc-deluxe/600/450",
        starRating: 4,
        price: 140,
      },
      {
        name: "Luxury Desert Camp",
        description: "Private luxury tents with plunge pools.",
        image: "https://picsum.photos/seed/morocco-acc-luxury/600/450",
        starRating: 5,
        price: 300,
      },
    ],
  });

  await seedPackage({
    slug: "icelandic-ring-road-adventure",
    name: "Icelandic Ring Road Adventure",
    description: "Nine days circling Iceland's Ring Road, from waterfalls to glacier lagoons.",
    durationDays: 9,
    includedServices: ["4x4 rental with driver-guide", "Airport transfers", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance", "Lunches and dinners"],
    coverImage: "https://picsum.photos/seed/iceland-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/iceland-gallery-1/600/600",
      "https://picsum.photos/seed/iceland-gallery-2/600/600",
      "https://picsum.photos/seed/iceland-gallery-3/600/600",
      "https://picsum.photos/seed/iceland-gallery-4/600/600",
    ],
    locations: [
      { name: "Golden Circle", description: "Geysir, Gullfoss, and Thingvellir National Park.", price: 420 },
      { name: "Vatnajokull Glacier Lagoon", description: "Boat tour among the icebergs of Jokulsarlon.", price: 550 },
      { name: "Skogafoss & Seljalandsfoss Waterfalls", description: "Guided stops at the south coast's iconic falls.", price: 300 },
    ],
    attributes: [
      { name: "Northern Lights photography tour", description: "Guided night tour chasing the aurora.", price: 95 },
      { name: "Glacier ice cave exploration", description: "Guided walk inside a real ice cave.", price: 130 },
    ],
    accommodations: [
      {
        name: "Countryside Guesthouse",
        description: "Simple guesthouse with shared facilities.",
        image: "https://picsum.photos/seed/iceland-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Design Hotel Reykjavik",
        description: "Modern boutique hotel in central Reykjavik.",
        image: "https://picsum.photos/seed/iceland-acc-deluxe/600/450",
        starRating: 4,
        price: 180,
      },
      {
        name: "Luxury Ion Adventure Hotel",
        description: "Design hotel on the edge of the highlands with a geothermal pool.",
        image: "https://picsum.photos/seed/iceland-acc-luxury/600/450",
        starRating: 5,
        price: 380,
      },
    ],
  });

  await seedPackage({
    slug: "kyoto-osaka-discovery",
    name: "Kyoto & Osaka Discovery",
    description: "Six days between Kyoto's temples and Osaka's street food, with a private guide throughout.",
    durationDays: 6,
    includedServices: ["Private guide", "Rail passes", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance"],
    coverImage: "https://picsum.photos/seed/kyoto-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/kyoto-gallery-1/600/600",
      "https://picsum.photos/seed/kyoto-gallery-2/600/600",
      "https://picsum.photos/seed/kyoto-gallery-3/600/600",
      "https://picsum.photos/seed/kyoto-gallery-4/600/600",
    ],
    locations: [
      { name: "Fushimi Inari Shrine", description: "Guided walk through the thousand torii gates.", price: 260 },
      { name: "Arashiyama Bamboo Grove", description: "Morning visit before the crowds arrive.", price: 220 },
      { name: "Osaka Castle & Dotonbori", description: "Castle grounds followed by the Dotonbori food district.", price: 300 },
    ],
    attributes: [
      { name: "Traditional tea ceremony", description: "Private tea ceremony with a certified host.", price: 60 },
      { name: "Sushi-making workshop", description: "Hands-on sushi class with a local chef.", price: 80 },
    ],
    accommodations: [
      {
        name: "Kyoto Business Hotel",
        description: "Compact, efficient hotel near the station.",
        image: "https://picsum.photos/seed/kyoto-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Ryokan with Onsen",
        description: "Traditional ryokan with a private onsen bath.",
        image: "https://picsum.photos/seed/kyoto-acc-deluxe/600/450",
        starRating: 4,
        price: 200,
      },
      {
        name: "Luxury Kyoto Ryokan",
        description: "Premium ryokan with kaiseki dining and a garden view.",
        image: "https://picsum.photos/seed/kyoto-acc-luxury/600/450",
        starRating: 5,
        price: 420,
      },
    ],
  });

  await seedPackage({
    slug: "costa-rica-rainforest-coast",
    name: "Costa Rica Rainforest & Coast",
    description: "Seven days from volcano hot springs to cloud forest canopies and a Pacific beach finale.",
    durationDays: 7,
    includedServices: ["Private driver-guide", "Domestic transfers", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance", "Lunches and dinners"],
    coverImage: "https://picsum.photos/seed/costarica-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/costarica-gallery-1/600/600",
      "https://picsum.photos/seed/costarica-gallery-2/600/600",
      "https://picsum.photos/seed/costarica-gallery-3/600/600",
      "https://picsum.photos/seed/costarica-gallery-4/600/600",
    ],
    locations: [
      { name: "Arenal Volcano & Hot Springs", description: "Volcano-view hike followed by natural hot springs.", price: 340 },
      { name: "Monteverde Cloud Forest", description: "Guided hike through the cloud forest reserve.", price: 300 },
      { name: "Manuel Antonio Beach", description: "Free time and wildlife spotting near the national park.", price: 260 },
    ],
    attributes: [
      { name: "Zipline canopy tour", description: "Guided zipline circuit through the rainforest canopy.", price: 75 },
      { name: "Night wildlife walk", description: "Guided night walk spotting nocturnal wildlife.", price: 50 },
    ],
    accommodations: [
      {
        name: "Eco Lodge Basic",
        description: "Simple eco-lodge rooms surrounded by rainforest.",
        image: "https://picsum.photos/seed/costarica-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Rainforest Boutique Lodge",
        description: "Boutique lodge with a pool and canopy views.",
        image: "https://picsum.photos/seed/costarica-acc-deluxe/600/450",
        starRating: 4,
        price: 150,
      },
      {
        name: "Luxury Beach Resort",
        description: "Beachfront resort suite near Manuel Antonio.",
        image: "https://picsum.photos/seed/costarica-acc-luxury/600/450",
        starRating: 5,
        price: 310,
      },
    ],
  });

  await seedPackage({
    slug: "vietnam-halong-bay-hanoi",
    name: "Vietnam: Halong Bay & Hanoi",
    description: "Six days between Hanoi's old quarter and an overnight cruise through Halong Bay's limestone karsts.",
    durationDays: 6,
    includedServices: ["Private guide", "Overnight cruise cabin", "Airport transfers"],
    excludedServices: ["International flights", "Travel insurance"],
    coverImage: "https://picsum.photos/seed/vietnam-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/vietnam-gallery-1/600/600",
      "https://picsum.photos/seed/vietnam-gallery-2/600/600",
      "https://picsum.photos/seed/vietnam-gallery-3/600/600",
      "https://picsum.photos/seed/vietnam-gallery-4/600/600",
    ],
    locations: [
      { name: "Hanoi Old Quarter", description: "Guided walk through the street-food lanes of the old quarter.", price: 260 },
      { name: "Halong Bay Cruise", description: "Overnight cruise among the limestone karsts.", price: 520 },
      { name: "Ninh Binh Rice Fields", description: "Boat ride through the Trang An landscape.", price: 300 },
    ],
    attributes: [
      { name: "Street food walking tour", description: "Evening tasting tour with a local host.", price: 45 },
      { name: "Cooking class in Hanoi", description: "Hands-on Vietnamese cooking class.", price: 60 },
    ],
    accommodations: [
      {
        name: "Old Quarter Standard Hotel",
        description: "Simple hotel steps from the night market.",
        image: "https://picsum.photos/seed/vietnam-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Halong Boutique Cruise Cabin",
        description: "Upgraded cabin with a private balcony.",
        image: "https://picsum.photos/seed/vietnam-acc-deluxe/600/450",
        starRating: 4,
        price: 130,
      },
      {
        name: "Luxury Lakeside Suite",
        description: "Suite overlooking Hoan Kiem Lake.",
        image: "https://picsum.photos/seed/vietnam-acc-luxury/600/450",
        starRating: 5,
        price: 270,
      },
    ],
  });

  await seedPackage({
    slug: "jordan-petra-wadi-rum",
    name: "Jordan: Petra & Wadi Rum",
    description: "Five days from the rose-red city of Petra to a night under the stars in Wadi Rum.",
    durationDays: 5,
    includedServices: ["Private driver-guide", "4x4 desert transfers", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance"],
    coverImage: "https://picsum.photos/seed/jordan-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/jordan-gallery-1/600/600",
      "https://picsum.photos/seed/jordan-gallery-2/600/600",
      "https://picsum.photos/seed/jordan-gallery-3/600/600",
      "https://picsum.photos/seed/jordan-gallery-4/600/600",
    ],
    locations: [
      { name: "Petra Archaeological Park", description: "Full-day guided exploration of the Treasury and Monastery.", price: 480 },
      { name: "Wadi Rum Desert", description: "Jeep safari through the red-sand valley.", price: 350 },
      { name: "Dead Sea Shoreline", description: "Free time floating at the lowest point on Earth.", price: 200 },
    ],
    attributes: [
      { name: "Petra by Night tour", description: "Candlelit evening walk to the Treasury.", price: 55 },
      { name: "Bedouin dinner under the stars", description: "Traditional zarb dinner in a desert camp.", price: 65 },
    ],
    accommodations: [
      {
        name: "Petra Standard Hotel",
        description: "Simple hotel near the park entrance.",
        image: "https://picsum.photos/seed/jordan-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Wadi Rum Desert Camp",
        description: "En-suite Bedouin-style tents under the stars.",
        image: "https://picsum.photos/seed/jordan-acc-deluxe/600/450",
        starRating: 4,
        price: 150,
      },
      {
        name: "Luxury Martian Dome",
        description: "Private glass-dome suite overlooking the desert.",
        image: "https://picsum.photos/seed/jordan-acc-luxury/600/450",
        starRating: 5,
        price: 320,
      },
    ],
  });

  await seedPackage({
    slug: "new-zealand-south-island-explorer",
    name: "New Zealand: South Island Explorer",
    description: "Nine days from Queenstown's adventure sports to the fjords of Milford Sound.",
    durationDays: 9,
    includedServices: ["Private driver-guide", "Domestic transfers", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance", "Lunches and dinners"],
    coverImage: "https://picsum.photos/seed/newzealand-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/newzealand-gallery-1/600/600",
      "https://picsum.photos/seed/newzealand-gallery-2/600/600",
      "https://picsum.photos/seed/newzealand-gallery-3/600/600",
      "https://picsum.photos/seed/newzealand-gallery-4/600/600",
    ],
    locations: [
      { name: "Queenstown Adventure Hub", description: "Lakefront town at the base of the Remarkables.", price: 340 },
      { name: "Milford Sound Cruise", description: "Scenic cruise through the fjord's waterfalls.", price: 480 },
      { name: "Franz Josef Glacier", description: "Guided glacier valley walk.", price: 360 },
    ],
    attributes: [
      { name: "Bungy jump at Kawarau Bridge", description: "The original commercial bungy jump site.", price: 120 },
      { name: "Scenic helicopter flight", description: "Alpine helicopter tour over the Southern Alps.", price: 250 },
    ],
    accommodations: [
      {
        name: "Queenstown Backpacker Lodge",
        description: "Simple lodge in the town centre.",
        image: "https://picsum.photos/seed/newzealand-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Lakeview Boutique Hotel",
        description: "Boutique hotel with views over Lake Wakatipu.",
        image: "https://picsum.photos/seed/newzealand-acc-deluxe/600/450",
        starRating: 4,
        price: 190,
      },
      {
        name: "Luxury Alpine Retreat",
        description: "Private lodge suite in the Southern Alps.",
        image: "https://picsum.photos/seed/newzealand-acc-luxury/600/450",
        starRating: 5,
        price: 400,
      },
    ],
  });

  await seedPackage({
    slug: "egyptian-nile-pyramids",
    name: "Egypt: Nile & Pyramids",
    description: "Seven days from the Pyramids of Giza to a Nile cruise between Luxor and Aswan.",
    durationDays: 7,
    includedServices: ["Private Egyptologist guide", "Nile cruise cabin", "Domestic flights"],
    excludedServices: ["International flights", "Travel insurance"],
    coverImage: "https://picsum.photos/seed/egypt-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/egypt-gallery-1/600/600",
      "https://picsum.photos/seed/egypt-gallery-2/600/600",
      "https://picsum.photos/seed/egypt-gallery-3/600/600",
      "https://picsum.photos/seed/egypt-gallery-4/600/600",
    ],
    locations: [
      { name: "Pyramids of Giza & Sphinx", description: "Guided tour of the Giza plateau.", price: 300 },
      { name: "Valley of the Kings", description: "Guided entry to the royal tombs near Luxor.", price: 420 },
      { name: "Nile Cruise, Luxor to Aswan", description: "Multi-day cruise stopping at temple sites along the Nile.", price: 600 },
    ],
    attributes: [
      { name: "Hot air balloon over Luxor", description: "Sunrise balloon flight over the West Bank.", price: 110 },
      { name: "Sound & Light Show at Karnak", description: "Evening show at the Karnak Temple complex.", price: 40 },
    ],
    accommodations: [
      {
        name: "Cairo Standard Hotel",
        description: "Simple hotel near the Giza plateau.",
        image: "https://picsum.photos/seed/egypt-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Nile View Deluxe Cruise Cabin",
        description: "Upgraded cabin with a private Nile-facing balcony.",
        image: "https://picsum.photos/seed/egypt-acc-deluxe/600/450",
        starRating: 4,
        price: 170,
      },
      {
        name: "Luxury Pyramids View Suite",
        description: "Suite with a private terrace facing the Pyramids.",
        image: "https://picsum.photos/seed/egypt-acc-luxury/600/450",
        starRating: 5,
        price: 360,
      },
    ],
  });

  await seedPackage({
    slug: "scottish-highlands-isles",
    name: "Scottish Highlands & Isles",
    description: "Seven days through misty glens, historic castles, and the Isle of Skye.",
    durationDays: 7,
    includedServices: ["Private driver-guide", "Ferry transfers", "Daily breakfast"],
    excludedServices: ["International flights", "Travel insurance", "Lunches and dinners"],
    coverImage: "https://picsum.photos/seed/scotland-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/scotland-gallery-1/600/600",
      "https://picsum.photos/seed/scotland-gallery-2/600/600",
      "https://picsum.photos/seed/scotland-gallery-3/600/600",
      "https://picsum.photos/seed/scotland-gallery-4/600/600",
    ],
    locations: [
      { name: "Edinburgh Old Town", description: "Guided walk from the Castle down the Royal Mile.", price: 260 },
      { name: "Loch Ness & Glencoe", description: "Scenic drive through the Highlands and Glencoe valley.", price: 340 },
      { name: "Isle of Skye", description: "Two-day exploration of Skye's cliffs and fairy pools.", price: 420 },
    ],
    attributes: [
      { name: "Whisky distillery tasting tour", description: "Guided tasting at a Highland distillery.", price: 60 },
      { name: "Castle history & private tour", description: "Private guided access to a historic Highland castle.", price: 80 },
    ],
    accommodations: [
      {
        name: "Highland Standard B&B",
        description: "Simple bed and breakfast in a Highland village.",
        image: "https://picsum.photos/seed/scotland-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Loch View Boutique Inn",
        description: "Boutique inn overlooking a Highland loch.",
        image: "https://picsum.photos/seed/scotland-acc-deluxe/600/450",
        starRating: 4,
        price: 165,
      },
      {
        name: "Luxury Castle Suite",
        description: "Suite inside a restored Highland castle.",
        image: "https://picsum.photos/seed/scotland-acc-luxury/600/450",
        starRating: 5,
        price: 350,
      },
    ],
  });

  await seedPackage({
    slug: "tanzania-safari-zanzibar",
    name: "Tanzania: Safari & Zanzibar",
    description: "Eight days on safari across the Serengeti, finishing on the beaches of Zanzibar.",
    durationDays: 8,
    includedServices: ["Private safari vehicle & guide", "Domestic flights", "All meals on safari"],
    excludedServices: ["International flights", "Travel insurance"],
    coverImage: "https://picsum.photos/seed/tanzania-cover/800/600",
    galleryImages: [
      "https://picsum.photos/seed/tanzania-gallery-1/600/600",
      "https://picsum.photos/seed/tanzania-gallery-2/600/600",
      "https://picsum.photos/seed/tanzania-gallery-3/600/600",
      "https://picsum.photos/seed/tanzania-gallery-4/600/600",
    ],
    locations: [
      { name: "Serengeti National Park", description: "Multi-day game drives across the Serengeti plains.", price: 700 },
      { name: "Ngorongoro Crater", description: "Full-day game drive inside the crater floor.", price: 450 },
      { name: "Zanzibar Beach & Stone Town", description: "Beach time and a guided walk through Stone Town.", price: 380 },
    ],
    attributes: [
      { name: "Hot air balloon safari", description: "Sunrise balloon flight over the Serengeti.", price: 140 },
      { name: "Spice farm tour in Zanzibar", description: "Guided tour of a working spice plantation.", price: 45 },
    ],
    accommodations: [
      {
        name: "Safari Standard Camp",
        description: "Simple tented camp with shared facilities.",
        image: "https://picsum.photos/seed/tanzania-acc-standard/600/450",
        starRating: 3,
        price: 0,
      },
      {
        name: "Serengeti Boutique Lodge",
        description: "En-suite tented lodge overlooking the plains.",
        image: "https://picsum.photos/seed/tanzania-acc-deluxe/600/450",
        starRating: 4,
        price: 210,
      },
      {
        name: "Luxury Zanzibar Beach Villa",
        description: "Private beachfront villa with a plunge pool.",
        image: "https://picsum.photos/seed/tanzania-acc-luxury/600/450",
        starRating: 5,
        price: 440,
      },
    ],
  });

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
