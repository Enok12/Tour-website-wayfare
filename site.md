# Wayfare — Customer Site Redesign: Site Map

Companion to `design.md`. Page-by-page breakdown of what changes, what data
backs each section, and which existing files/components are touched. No new
API routes or schema — every section below is served by data already
exposed through `PackageDto`, `TourRequestDto`, or `TrackingResult`
(`src/types/index.ts`).

---

## `/` — Home (`src/app/(marketing)/page.tsx`)

Fetches `GET /api/packages` (already does).

1. **Hero** — full-bleed image (first active package's `coverImage`, or a
   configured fallback), gradient scrim, headline/subhead/dual-CTA overlay,
   slow Ken Burns zoom. Replaces the current SVG-diagram split hero.
2. **Trust-badge row** — 3 icons ("Reviewed by a person" / "Vetted local
   guides" / "No booking fees"), static copy, no data dependency.
3. **How it works** — keep `JourneyDiagram` as-is (already good, no reference
   pattern beats a simple 3-step diagram for this).
4. **Destination strip** — one image card per active package (reuse/upgrade
   `PackageCard`), `slice(0, 6)` or so, "View all" → `/packages`. **No
   pricing** — cards lead with place (duration + a few location names + "N
   places to visit"), per updated `design.md` §5.
5. **Closing CTA band** — keep existing pine-900 "Not sure what you want yet"
   section, visual polish only.

Files touched: `page.tsx`, `package-card.tsx` (upgraded), new hero component
(e.g. `src/components/landing/hero.tsx`), new trust-badge row component.

---

## `/packages` (`src/app/(marketing)/packages/page.tsx`)

Fetches `GET /api/packages` (already does). Becomes a proper gallery page
instead of a bare grid:

1. Short intro band (headline + one line, matches About/FAQ header pattern).
2. Grid of upgraded `PackageCard`s — same data, better presentation (larger
   image, "N places to visit" count from `pkg.locations`). **No pricing**,
   same as the Home destination strip.

No new data needed — `PackageDto.locations`/`durationDays`/`coverImage` are
already there.

---

## `/packages/[slug]` (`src/app/(marketing)/packages/[slug]/page.tsx`)

Fetches `GET /api/packages/slug/[slug]` (already does). Visual pass over the
existing sections — all data already present on `PackageDto`. **No pricing
anywhere on this page** (revised — see `design.md` §6); every section below
is descriptive/inspirational only:

1. Full-bleed cover-image hero (replaces current boxed `aspect-16/9` image),
   name/duration overlaid — no price.
2. Description.
3. **Places you'll visit** (`pkg.locations`) — richer tile/list treatment,
   name + `description` per location — no per-location price.
4. Included / Not included (`includedServices`/`excludedServices`) — keep,
   never had pricing.
5. **Customize this trip** (`pkg.attributes`) — name + description only, the
   "+$X" tags are dropped here.
6. **Accommodation options** (`pkg.accommodations`, star-badge grid) — kept
   as the photo-tile grid (still place/experience content), but the "+$X"
   price line under each tile is dropped; star-rating badge stays.
7. CTA band → `/customize?package=<slug>` — copy shifts toward "Plan this
   trip with us" rather than a booking/checkout framing.

Files touched: `packages/[slug]/page.tsx` only.

---

## `/customize` (`src/app/(marketing)/customize/page.tsx` + `customize-form.tsx`)

**Functional behavior unchanged** (multi-package select, locations/
attributes/accommodation, live pricing) — this page's logic was the subject
of the last two sessions and stays as-is per "don't touch the backend."
Visual pass only:

1. Header band matches the new About/FAQ/Contact header treatment.
2. `PackageSelector` gets spacing/typography polish to match the rest of the
   redesigned site (already has photography, animations, and the responsive
   accommodation grid from recent work — this page is closest to "done").

Files touched: `customize/page.tsx` (header), `package-selector.tsx`
(spacing/type only, no logic changes).

---

## `/about` (`src/app/(marketing)/about/page.tsx`)

Content unchanged (existing copy is good and on-brand). Visual pass:

1. Header band — larger display-serif treatment, matching hero scale.
2. New full-width photographic band between headline and the 3 values cards
   (a package `coverImage` or a static brand image) — currently this page is
   all-white/text, out of step with the rest of the redesigned site.
3. Values grid (`Compass`/`ShieldCheck`/`HeartHandshake`) — keep content,
   visual pass (bigger icons, more breathing room).

No data changes — this page doesn't fetch anything today and doesn't need to.

---

## `/faq` (`src/app/(marketing)/faq/page.tsx`)

Content unchanged. Visual pass: header band treatment, accordion-style
spacing polish (currently a plain divided list — keep the mechanism, just
bring typography/spacing in line with the rest of the site).

---

## `/contact` (`src/app/(marketing)/contact/page.tsx`)

Content unchanged. Visual pass: header band treatment, channel cards get the
same card styling upgrade as `PackageCard`, closing CTA band polish (already
matches the pine-900 band pattern used elsewhere — keep).

---

## `/track` (`src/app/(marketing)/track/page.tsx`)

Fetches via `useTrackBooking()` → `TrackingResult` (already does). This is a
functional/utility page (enter a reference, see status) — reference sites
don't have an equivalent, so no new pattern to borrow. Visual pass only:
header band treatment, result card styling brought in line with the rest of
the redesign (currently already reasonably clean — lowest priority page).

---

## Shared components

- **`Navbar`** — visual pass (sticky, backdrop-blur already good); no
  structural nav changes — Wayfare's page count doesn't warrant Jetwing's
  mega-menu or Sri Lanka Tourism's tiered categories.
- **`Footer`** — visual pass only, structure (4-column) already mirrors the
  reference sites' footer density reasonably well.
- **New**: `src/components/landing/hero.tsx` (full-bleed image hero w/ Ken
  Burns motion, reused by Home; other pages use a smaller header-band variant
  of the same component or a lighter sibling component).
- **New**: `src/components/landing/trust-badges.tsx` (3-icon row, Home only
  for now).

---

## Explicitly unchanged

`src/app/admin/**`, `src/app/member/**`, `src/app/login/**`, all
`src/server/**`, `prisma/**`, all API routes, all DTOs/types. This is a
`src/app/(marketing)/**` + `src/components/landing/**` +
`src/components/shared/**` (shared bits like `PackageCard`, `Logo`) visual
and layout project only.
