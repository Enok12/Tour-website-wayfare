# Wayfare — Customer Site Redesign: Design Direction

Scope: customer-facing marketing site only — everything under `src/app/(marketing)`
plus the shared `Navbar`/`Footer`/landing components. **Not in scope:** admin
dashboard, member dashboard, login, or any backend/API/schema changes.

## References studied

- **srilanka.travel** — official tourism board site. Category-driven discovery
  (single-word experience tags: WILD, PRISTINE, BLISS...), search-first hero,
  card-heavy homepage, heavy use of saturated nature photography, government/
  trust-authority tone.
- **jetwinghotels.com** — luxury hotel group. Restrained neutral palette that
  lets full-bleed photography/video do the work, generous whitespace, tiered
  collection cards (Luxury Reserves / Premium / Select / Essentials), a
  persistent booking widget, trust-badge row (Best Rate Guaranteed / Flexible
  Policies / Exclusive Discounts), destination-clustered navigation.

**What we're taking from each:** Sri Lanka Tourism's card-based discovery
structure and confident photography scale; Jetwing's restraint, whitespace,
and trust-badge pattern. **What we're not copying:** their color palettes
(ocean blues / neutral-beige) — Wayfare already has a deliberate, distinct
identity (deep pine + brass, warm linen background) that reads as a
hand-curated operator, not a government portal or generic luxury chain. The
redesign elevates the existing identity rather than replacing it.

## Current foundation (keep)

- Palette: `--pine-950…50`, `--brass-600…100`, `--linen`/`--linen-dark`,
  `--ink`/`--ink-muted` (`src/app/globals.css`) — already distinctive, no
  changes needed to the tokens themselves.
- Type: Georgia/serif `--font-display` for headings + system sans for body —
  keep. Reference sites lean on scale/weight for hierarchy rather than color;
  we'll push our display serif larger/bolder at hero scale to match that
  confidence.
- `PageTransition` (framer-motion fade/slide on route change) and the top
  loading bar — keep, already site-wide.
- Brand differentiator to keep foregrounded everywhere (nav, hero, footer):
  **"a person reads every request, not an algorithm."** This is Wayfare's
  actual edge over both reference sites (which are either a government
  portal or a big hotel group) — the redesign should make this feel premium
  and personal, not smaller/scrappier.

## What's changing

### 1. Photography-first, not illustration-first
The current homepage hero is an abstract SVG line-drawing placeholder. Both
reference sites are dominated by real photography/video. We have real image
URLs already flowing through the data (`coverImage`, `galleryImages` on
packages, `image` on accommodations) — the redesign leans on **that** imagery
everywhere it exists, with a consistent elegant fallback (soft pine-tinted
gradient + a single line icon, already the pattern in `PackageCard`) where it
doesn't. No new fake stock photography is invented; sections without real
imagery use typographic/graphic treatment instead of placeholder photos.

### 2. Hero: full-bleed image + Ken Burns motion, not a split layout
Replace the current two-column hero (headline left / SVG diagram right) with
a full-bleed photographic hero (a package's `coverImage`, e.g. the featured
package) with a gradient scrim for text legibility, headline + subhead + dual
CTA overlaid — matching Jetwing's hero weight. Since we have no video assets,
a slow CSS/framer-motion scale (`Ken Burns`) on the background image
substitutes for Jetwing's video loop, giving the same "alive" feeling at zero
asset cost.

### 3. Category-style discovery row (adapted from Sri Lanka Tourism)
Sri Lanka Tourism's 8 single-word experience cards work because they're a
*discovery* mechanism across a huge catalog. We have a small, curated catalog
(a handful of packages), so instead of inventing categories we don't have
data for, adapt the pattern to what's real: a **destination strip** — one
card per active package, image-forward, showing name + duration + a taste of
what's in it (see #5 — no price here), linking to its detail page. Same
visual language (large image, minimal text overlay), honest to our actual
data.

### 4. Trust-badge row (adapted from Jetwing)
Jetwing's "Best Rate Guaranteed / Flexible Policies / Exclusive Discounts"
row becomes ours: **"Reviewed by a person" / "Vetted local guides" /
"No booking fees, ever"** (or similar, copy TBD at build time) — three-icon
row directly under the hero, reusing the existing `ShieldCheck`/`Users`-style
icon treatment already in the current hero, just promoted into its own
dedicated section per the reference pattern instead of being small print.

### 5. Package cards: no pricing, lead with place
**Revised per feedback:** discovery surfaces (destination strip, `/packages`
grid) show **zero pricing or priced-attribute information**. The goal is a
customer falling in love with a place, not price-comparing a grid — pricing
only belongs in the transactional `/customize` flow (see principle below).
Upgrade `PackageCard` to replace the current "from $X" line with:
- Duration (`durationDays`) — logistical, not a price, stays.
- **A taste of the itinerary** — the names of 2–3 of `pkg.locations`
  (e.g. "Ubud · Tanah Lot · Seminyak"), pulled the same way the removed
  price used to be, giving a concrete sense of place instead of a number.
- The existing description snippet (`line-clamp-2`), kept.
- **"N places to visit"** count (`pkg.locations.filter(l => l.isActive).length`)
  — real data unique to Wayfare, and now doing double duty as the thing that
  replaces price as the card's bottom-line stat.

### 6. Package detail page: inspiration first, price only at the door
Still the "hero" experience page structurally (full-bleed cover image,
generously-spaced sections) — but **every price tag currently shown here
comes off**. Concretely:
- Header price ("starting from $X") — removed.
- **Places you'll visit** — shown as a rich, descriptive list/tile (location
  name + its `description`, if set) — no per-location price.
- **Customize this trip** (attributes) — shown as a plain descriptive list
  (name + description) — no "+$X" tags.
- **Accommodation options** — kept as the photo-tile grid (this is genuinely
  about *where you'd stay*, i.e. still place/experience content), but the
  "+$X" price line under each tile is dropped; star-rating badge stays.
- CTA copy shifts from "Request this package" framing toward "Plan this trip
  with us" — the page's job is to get someone to start a conversation, not
  to checkout.

**Principle: pricing lives in exactly one place — `/customize`.** That's
where a customer is actively selecting locations/attributes/accommodation
and a running total is genuinely useful information, not a distraction from
falling in love with the trip. No other page shows a dollar figure. This
also reads as more on-brand: a bespoke operator discusses price once you're
actually building a trip with them, not as a shelf price on a rack.

### 7. About / FAQ / Contact — visual pass, not content rewrite
Existing copy is good and on-brand ("every trip read by a person"). These
pages get the same typographic scale-up and spacing treatment as the rest of
the site, plus a full-width photographic band (About) instead of remaining
plain-white text pages — bringing them in line with the more editorial,
photography-forward feel established on Home/Packages.

### 8. Footer — same structure, more presence
Keep the 4-column structure (`Footer.tsx`) — it already mirrors Jetwing's
link-heavy footer reasonably well. Visual pass only: larger logo treatment,
slightly more vertical rhythm, keep pine-950 dark background.

## Motion & interaction principles

- Reuse what exists: `PageTransition`, top loader, `Checkbox`/tile animations
  already shipped — no new animation *system*, just extending the same
  framer-motion vocabulary (spring hover/tap, fade+slide entrances) to new
  sections (destination strip cards, trust-badge icons on scroll-into-view).
- One new pattern: subtle scroll-reveal (fade + 8px rise, matching the
  existing `PageTransition` easing/duration) on section entry for the
  homepage's stacked sections, since both reference sites feel considerably
  more "alive" while scrolling than our current static stack.
- Respect `useReducedMotion` everywhere new motion is added, matching the
  existing `PageTransition` precedent.

## Non-goals

- No new database fields/tables, no admin form changes, no pricing-logic
  changes — this is a visual/layout pass over existing data only.
- No fabricated testimonials, review scores, or stock imagery presented as
  real. If a section reads better with a photo we don't have, it gets a
  typographic/graphic treatment instead, not a placeholder passed off as real.
- Admin/member dashboards and `/login` are untouched.
