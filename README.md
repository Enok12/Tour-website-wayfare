# Wayfare Tours — Tour Management Platform (MVP)

A tour management platform for a tourism business where the admin personally
reviews every incoming trip request and hand-assigns it to one of their
trusted guides. This is **not** an Uber-style automatic matching system --
every assignment is a deliberate choice made by the admin.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** + hand-built shadcn-style UI primitives (Radix UI underneath)
- **Prisma ORM** + **PostgreSQL** (designed for **Neon**, works with any Postgres)
- **JWT authentication** (via `jose`), httpOnly cookies, role-based authorization
- **React Hook Form** + **Zod** for validation (shared schemas between client and server)
- **TanStack Query** for client-side data fetching/caching
- **Cloudinary** (via `next-cloudinary`) for image uploads
- **REST API** architecture with Controller -> Service -> Repository -> Prisma layering

## Architecture

```
Frontend (Next.js Server & Client Components)
        |  fetch("/api/...")
        v
REST API routes         (src/app/api/**/route.ts)
        |  thin wrappers, no business logic
        v
Controllers              (src/server/controllers)
        |  auth checks, request/response shaping
        v
Services                 (src/server/services)
        |  business rules, orchestration
        v
Repositories              (src/server/repositories)
        |  Prisma queries only
        v
Prisma ORM  ->  PostgreSQL
```

The frontend **never** imports Prisma or touches the database directly --
even Server Components fetch through the REST API (`src/lib/server-fetch.ts`)
so there is exactly one API surface, which is what a future Android/iOS app
would also use.

Cross-cutting concerns are centralized:

- `src/server/middleware/with-error-handling.ts` -- every route is wrapped so
  thrown errors become consistent JSON responses.
- `src/server/middleware/auth.ts` -- `requireUser` / `requireRole` guards.
- `src/server/middleware/validate.ts` -- Zod-based body/query parsing.
- `src/server/lib/logger.ts` -- structured logging.
- `src/middleware.ts` -- edge middleware protecting `/admin` and `/member`
  routes by role before a page ever renders.

## Folder structure

```
prisma/schema.prisma        Database schema
prisma/seed.ts               Demo data (admin + guides + packages)

src/server/
  dto/                       Zod validation schemas (shared with the client)
  repositories/              Prisma queries
  services/                  Business logic
  controllers/               HTTP-facing orchestration
  middleware/                Auth, validation, error handling
  lib/                       prisma client, jwt, password hashing, etc.

src/app/
  (marketing)/                Public site: home, about, packages, customize,
                               contact, faq, track -- all share one layout
  login/                      Sign-in for admins & guides
  admin/                       Admin dashboard (protected, role=ADMIN)
  member/                      Guide dashboard (protected, role=MEMBER)
  api/                         REST endpoints

src/components/                UI: ui/ (primitives), admin/, member/, landing/, shared/
src/hooks/                     TanStack Query hooks per resource
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in:

- `DATABASE_URL` -- your Neon (or any Postgres) connection string. For local
  development without Neon, run `docker compose up -d` and use:
  `postgresql://postgres:postgres@localhost:5432/tourplatform?schema=public`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `NEXTAUTH_SECRET` -- generate with
  `openssl rand -base64 32`
- Cloudinary variables -- optional for local dev. Without them, image fields
  fall back to a plain URL input so the rest of the app still works.

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

This creates the schema and seeds demo accounts:

| Role  | Email                                | Password      |
|-------|---------------------------------------|---------------|
| Admin | admin@wayfare-tours.example            | password123   |
| Guide | sam.guide@wayfare-tours.example        | password123   |
| Guide | priya.guide@wayfare-tours.example      | password123   |

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, or `/login` to sign in as
an admin or guide.

## Customer flow (no login required)

1. Customer browses `/packages` or fills in `/customize`.
2. Submitting either creates a `TourRequest` and returns a **booking
   reference** (e.g. `TRK-2026-4F82`).
3. The customer can check status any time at `/track` using that reference --
   no account needed.

## Admin flow

1. Sign in at `/login` -> redirected to `/admin`.
2. `/admin/requests` -- filter/search all requests, open one to see full
   details, add internal notes, and **assign a member** from the list of
   currently-available guides.
3. `/admin/packages` and `/admin/members` -- full CRUD for packages and guides
   (guides are deactivated rather than hard-deleted, preserving history).

## Guide (member) flow

1. Sign in at `/login` -> redirected to `/member`.
2. Guides only ever see tours assigned to them (enforced server-side, not
   just hidden in the UI).
3. Opening a tour shows customer contact info, pickup details, trip details,
   and any notes from the office, with buttons to progress status: **Accept
   -> Start -> Complete**.

## Deploying

This app deploys cleanly to **Vercel**:

1. Push to a Git repository and import it in Vercel.
2. Add the same environment variables from `.env` in the Vercel project
   settings (use your real Neon connection string).
3. Vercel runs `npm install`, which triggers `prisma generate` via the
   `postinstall` script.
4. Run `npx prisma migrate deploy` against your production database (locally,
   pointed at the prod `DATABASE_URL`, or via a CI step) before first launch.

## Extending this MVP

The schema and layering were deliberately kept narrow so the modules listed
in the original brief can be added without restructuring what's here:

- **Payments / Commission** -- add a `Payment` model referencing `TourRequest`;
  the service layer already isolates business rules from the API shape.
- **Vehicles / Drivers** -- new `Vehicle` model + a join to `Assignment`.
- **Reviews** -- a `Review` model referencing `TourRequest` + `Customer`.
- **Chat / Push Notifications / GPS Tracking** -- additive; the `Assignment`
  and `TourRequest` models are the natural anchors for all three.
- **Multi-language / Multi-currency** -- `TourPackage.currency` already exists;
  add a locale field and translate content tables.
- **Android / iOS** -- the REST API under `src/app/api` is the entire contract;
  the JWT auth layer already supports `Authorization: Bearer <token>` as an
  alternative to cookies for exactly this reason.
- **SaaS multi-tenant** -- introduce an `Organization` model and scope
  `User`/`Customer`/`TourPackage`/`TourRequest` to it; the repository layer is
  the only place queries would need an `organizationId` filter added.

## Known limitations of this build

- Image uploads require a Cloudinary account (cloud name + an **unsigned**
  upload preset) to be configured in `.env`; without it, cover/profile images
  fall back to manual URL entry.
- Activity logging (`ActivityLog` model) is written on every mutation for
  audit purposes but isn't yet surfaced in the UI -- a natural first addition.
- Emails/SMS notifications (e.g. "your tour was assigned") aren't wired up;
  the `ActivityLog` entries provide the hook points to add them.
