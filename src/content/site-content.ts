/**
 * Editorial content for the marketing site.
 *
 * Everything in this file is *authored copy*, not data from the database --
 * it lives here so the team can edit the words without touching components.
 *
 * NOTE: the `TESTIMONIALS` and `STATS` exports are PLACEHOLDER copy, written
 * to fill the design. Replace them with real traveller quotes and real
 * figures (or delete those sections) before going live -- invented social
 * proof should not ship as if it were genuine.
 *
 * Photography referenced here lives in /public/images/lk and is credited in
 * public/images/lk/CREDITS.md.
 */

import {
  Binoculars,
  Compass,
  Landmark,
  TrainFront,
  Waves,
  Leaf,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ brand */

export const BRAND = {
  name: "Wayfare",
  tagline: "Journeys that stay with you",
  phone: "+94 77 123 4567",
  phoneHref: "tel:+94771234567",
  email: "hello@wayfare-tours.example",
  hours: "Mon-Sat, 9am-6pm",
  office: "Colombo, Sri Lanka - open by appointment",
} as const;

/* ------------------------------------------------------------------- hero */

export interface HeroSlide {
  image: string;
  alt: string;
  caption: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    image: "/images/lk/hero-ella-bridge.jpg",
    alt: "A train crossing the Nine Arch Bridge above the jungle canopy at Ella",
    caption: "Nine Arch Bridge, Ella",
  },
  {
    image: "/images/lk/hero-tea-country.jpg",
    alt: "Mist drifting across terraced tea plantations near Haputale",
    caption: "Tea country, Haputale",
  },
  {
    image: "/images/lk/hero-sigiriya.jpg",
    alt: "Sigiriya rock fortress rising out of the plain, seen from Pidurangala",
    caption: "Sigiriya, Cultural Triangle",
  },
];

/* --------------------------------------------------------------- benefits */

export interface Benefit {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const BENEFITS: Benefit[] = [
  {
    icon: Leaf,
    title: "Handpicked experiences",
    body: "Curated with local expertise",
  },
  {
    icon: Compass,
    title: "Read by a person",
    body: "Never sorted by an algorithm",
  },
  {
    icon: Landmark,
    title: "Flexible bookings",
    body: "Easy changes and cancellations",
  },
  {
    icon: Binoculars,
    title: "No booking fees",
    body: "What you agree is what you pay",
  },
];

/* ------------------------------------------------------------ experiences */

export interface Experience {
  slug: string;
  icon: LucideIcon;
  title: string;
  body: string;
  image: string;
  alt: string;
}

export const EXPERIENCES: Experience[] = [
  {
    slug: "wildlife-safaris",
    icon: Binoculars,
    title: "Wildlife safaris",
    body: "Leopards in Yala, elephants gathering at Minneriya, blue whales off the southern coast - tracked with guides who read the land rather than a timetable.",
    image: "/images/lk/exp-wildlife.jpg",
    alt: "A Sri Lankan leopard resting on a rock in Yala National Park",
  },
  {
    slug: "cultural-encounters",
    icon: Landmark,
    title: "Cultural encounters",
    body: "Kandyan dance, the Temple of the Sacred Tooth Relic, and the rock fortresses of the Cultural Triangle - introduced by people who grew up with them.",
    image: "/images/lk/exp-culture.jpg",
    alt: "Kandyan dancers performing in traditional costume",
  },
  {
    slug: "scenic-train-journeys",
    icon: TrainFront,
    title: "Scenic train journeys",
    body: "The Kandy to Ella line through tea country - window down, feet up, and the day most travellers end up naming as the best of their trip.",
    image: "/images/lk/hero-ella-bridge.jpg",
    alt: "A train crossing the Nine Arch Bridge at Ella",
  },
  {
    slug: "coast-and-water",
    icon: Waves,
    title: "Coast and water",
    body: "Stilt fishermen at dawn near Galle, surf at Arugam Bay, and quiet stretches of the south coast that never make the guidebooks.",
    image: "/images/lk/exp-coast.jpg",
    alt: "Traditional stilt fishermen at work on the coast near Galle",
  },
];

/* ------------------------------------------------- destination imagery map */

/**
 * Destinations on the site are derived from the *real* locations attached to
 * published packages (`PackageDto.locations`). Location records have no image
 * column, so this map supplies a photograph for the places we have one for.
 * Anything not listed falls back to its parent package's cover image, and
 * then to a typographic tile -- no destination is ever invented here.
 */
export const DESTINATION_IMAGES: Record<
  string,
  { image: string; alt: string; region: string }
> = {
  ella: {
    image: "/images/lk/dest-ella.jpg",
    alt: "Railway winding through the hills near Ella",
    region: "Hill Country",
  },
  sigiriya: {
    image: "/images/lk/dest-sigiriya.jpg",
    alt: "Sigiriya rock fortress",
    region: "Cultural Triangle",
  },
  galle: {
    image: "/images/lk/dest-galle.jpg",
    alt: "The lighthouse inside Galle Fort",
    region: "South Coast",
  },
  mirissa: {
    image: "/images/lk/dest-mirissa.jpg",
    alt: "Palm-fringed sand at Mirissa beach",
    region: "South Coast",
  },
  kandy: {
    image: "/images/lk/dest-kandy.jpg",
    alt: "The Temple of the Sacred Tooth Relic in Kandy",
    region: "Central Highlands",
  },
  "nuwara eliya": {
    image: "/images/lk/dest-nuwara-eliya.jpg",
    alt: "Tea estate near Nuwara Eliya",
    region: "Hill Country",
  },
  unawatuna: {
    image: "/images/lk/dest-unawatuna.jpg",
    alt: "Jungle Beach near Unawatuna",
    region: "South Coast",
  },
  haputale: {
    image: "/images/lk/hero-tea-country.jpg",
    alt: "Tea plantations in fog at Haputale",
    region: "Hill Country",
  },
  minneriya: {
    image: "/images/lk/exp-elephants.jpg",
    alt: "Elephants gathering at Minneriya National Park",
    region: "North Central",
  },
  yala: {
    image: "/images/lk/exp-wildlife.jpg",
    alt: "A leopard in Yala National Park",
    region: "Southeast",
  },
};

/**
 * Resolves the imagery entry for a location name using a loose match, so
 * "Nuwara Eliya tea plantation visit" still finds the Nuwara Eliya photo.
 */
export function destinationImageFor(name: string) {
  const key = name.trim().toLowerCase();
  if (DESTINATION_IMAGES[key]) return DESTINATION_IMAGES[key];
  const hit = Object.keys(DESTINATION_IMAGES).find((k) => key.includes(k));
  return hit ? DESTINATION_IMAGES[hit] : undefined;
}

/* ----------------------------------------------------------- testimonials */

export interface Testimonial {
  quote: string;
  name: string;
  country: string;
  initials: string;
}

/** PLACEHOLDER -- replace with real, attributable traveller quotes. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "An incredible experience from start to finish. Every detail was planned around what we actually wanted, and our guide showed us parts of the island we would never have found on our own.",
    name: "Sarah Mitchell",
    country: "Australia",
    initials: "SM",
  },
  {
    quote:
      "We asked for two weeks with a five-year-old in tow and no fixed itinerary. They read the request properly, called us, and built something that genuinely worked for a family.",
    name: "Daniel Okonkwo",
    country: "United Kingdom",
    initials: "DO",
  },
  {
    quote:
      "The train to Ella, the leopards at Yala, an afternoon with a tea picker who has worked the same estate for thirty years. Not a single day felt like a package tour.",
    name: "Lena Vogel",
    country: "Germany",
    initials: "LV",
  },
];

/* ------------------------------------------------------------------ stats */

export interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}

/** PLACEHOLDER -- replace with figures you can actually stand behind. */
export const STATS: Stat[] = [
  { value: "10,000+", label: "Happy travellers", icon: Compass },
  { value: "250+", label: "Curated experiences", icon: Leaf },
  { value: "50+", label: "Destinations", icon: Landmark },
  { value: "98%", label: "Traveller satisfaction", icon: Binoculars },
];

/* ----------------------------------------------------------- travel guide */

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
  readMinutes: number;
  excerpt: string;
  image: string;
  alt: string;
  /** Body paragraphs, rendered in order on the article page. */
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "hidden-gems-sri-lanka",
    title: "Ten quiet corners of Sri Lanka worth the detour",
    category: "Destinations",
    date: "2026-02-18",
    readMinutes: 7,
    excerpt:
      "Beyond the Cultural Triangle and the south-coast beaches sits an island most itineraries skip entirely. These are the detours our guides suggest first.",
    image: "/images/lk/story-misty.jpg",
    alt: "Mist hanging over forested hills at dawn in Sri Lanka",
    body: [
      "Most first trips to Sri Lanka follow the same loop: Colombo, Sigiriya, Kandy, Ella, the south coast, home. It is a good loop. It is also, by some margin, the busiest one, and it leaves out roughly two-thirds of the island.",
      "The detours below all come from our guides rather than a guidebook. Each adds a day or less to a standard route, and every one of them is somewhere our team has actually taken travellers.",
      "Start in the Knuckles Range, an hour and a half east of Kandy, where cardamom and pine give way to grassland above 1,500 metres. There are no crowds here because there is no single headline sight - just villages, leeches after rain, and some of the best walking on the island.",
      "In the north, Jaffna rewards anyone willing to make the long drive or take the morning train. The food is different, the temples are different, and the peninsula islands - Nainativu, and Delft with its wild ponies - feel a very long way from a resort.",
      "On the east coast, Arugam Bay draws surfers from May to September and empties out completely the rest of the year. Come in the off season and you get a fishing village with a very good bakery and a lagoon full of birds.",
      "Ask your guide about the others when you plan your trip: they change with the season, and half the value of a local guide is knowing which of them is worth it this month.",
    ],
  },
  {
    slug: "sri-lankan-food-guide",
    title: "A traveller's guide to eating in Sri Lanka",
    category: "Food and culture",
    date: "2026-01-30",
    readMinutes: 9,
    excerpt:
      "Rice and curry is not one dish - it is a format, and it changes every hundred kilometres. Here is how to order well from the coast to the hill country.",
    image: "/images/lk/story-paddy.jpg",
    alt: "Ripened rice paddy in the Sri Lankan lowlands",
    body: [
      "The single most useful thing to understand about Sri Lankan food is that rice and curry describes a structure, not a recipe. You get rice, then anywhere between three and a dozen small dishes around it, and you are expected to build each mouthful yourself.",
      "In the hill country those side dishes lean towards root vegetables and greens. On the coast they lean towards fish - often ambul thiyal, tuna cured almost black with goraka, which keeps for days without refrigeration and tastes far better than that description suggests.",
      "Breakfast is where the island is at its most distinctive. Hoppers, the bowl-shaped fermented rice pancakes, arrive crisp at the edge and soft in the middle, usually with an egg dropped into the base. String hoppers are their steamed cousin, served in stacks with dhal and a coconut sambol.",
      "Kottu is the late-night dish, and you will hear it before you see it: flatbread chopped on a hot griddle with two blades, in a rhythm that carries several streets.",
      "One practical note. Not spicy is a relative measurement. If you are unsure, ask for the sambol on the side rather than asking the kitchen to change the curry - you keep the flavour and control the heat yourself.",
    ],
  },
  {
    slug: "best-time-to-visit",
    title: "When to visit Sri Lanka, and why the answer is two answers",
    category: "Planning",
    date: "2026-01-12",
    readMinutes: 6,
    excerpt:
      "The island runs two monsoons on opposite schedules, which means there is always a good half of the country to be in. Timing a trip is really about choosing a coast.",
    image: "/images/lk/dest-mirissa.jpg",
    alt: "A calm palm-fringed beach on the south coast",
    body: [
      "Sri Lanka has two monsoons. The Yala monsoon brings rain to the west and south from roughly May to September; the Maha monsoon soaks the north and east from around October to January. They do not overlap, which is the single most useful planning fact about the island.",
      "In practice: December through March is the season for the south and west coasts, Galle, Mirissa and the hill country. April through September is the season for Trincomalee, Nilaveli, Arugam Bay and the Cultural Triangle.",
      "The Cultural Triangle - Sigiriya, Polonnaruwa, Dambulla - is comfortable most of the year, though it is genuinely hot from March to May. Start those sites at opening time rather than mid-morning.",
      "Shoulder seasons are underrated. April and September both sit between the two monsoons, and while you may lose an afternoon to rain, you will have the Sigiriya staircase largely to yourself.",
      "If your dates are fixed, tell us and we will build the route around the weather rather than the other way round. That is usually a better trip than moving the dates.",
    ],
  },
];

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
