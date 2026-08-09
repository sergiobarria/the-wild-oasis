# MVP Task List

Derived from [`00_SPEC.md`](00_SPEC.md). This is the build order for the first shippable
version of the product. Tasks are grouped into phases; phases are ordered by dependency,
not by section number in the spec. Within a phase, tasks can generally be parallelized.

Each task lists its spec references so implementers can go straight to the source
requirement instead of re-deriving it here.

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done

---

## How to use this doc

- **Schema grows with the feature, never ahead of it.** There is no single "define the
  schema" task. `convex/schema.ts` starts with almost nothing and each phase adds the
  `defineTable` calls that phase's feature actually needs, right when that feature is
  built — not earlier. A table modeled before its feature exists gets guessed wrong and
  is more expensive to fix once other code depends on it; a table added alongside the
  feature that needs it gets modeled with real requirements in hand. Where a task
  introduces a new table, it says so explicitly ("defines `X` schema").
- Every task has a stable ticket ID (`WO-NNN`), assigned once and never reused or
  renumbered — sequential order across phases, not a priority ranking. Reference it in
  commit messages and PR titles, e.g. `WO-004: build /brand design system page`.
- Check a task off only when `bun run check && bun run typecheck && bun run test` pass
  for the code it touched, per `AGENTS.md`.
- A task that turns out to be bigger than it looks gets split into subtasks in place
  (`WO-004a`, `WO-004b`, …) rather than silently expanding scope under one ID.
- If a task reveals a spec ambiguity, resolve it the way `00_SPEC.md` §4 (Non-Goals)
  points: smallest thing that satisfies the goal, not the enterprise version.
- New tasks discovered during implementation get appended to the relevant phase with the
  next unused ticket number, not bolted onto whatever task is currently active.

---

## Phase 0 — Design System & Brand Foundation

Everything visual downstream depends on this. No feature UI should be built against the
default shadcn theme currently in `app/globals.css` — it's the stock neutral palette, not
the brand. No database schema is touched in this phase.

- [x] **WO-001 (0.1) — Replace theme tokens with the spec's dark-first palette**
      Rewrite `:root` / `.dark` in `app/globals.css` using the OKLCH values in spec §13
      (background, foreground, primary gold/yellow, card, border, destructive). Dark mode
      is the primary brand experience — light mode stays technically supported but is not
      the design target. Keep `--radius: 0.625rem` per §15.
      _Depends on: nothing._

- [x] **WO-002 (0.2) — Wire Josefin Sans as the primary font**
      Add via `next/font/google`, expose as `--font-sans` (already aliased in
      `@theme inline`). Fallback stack per spec §14. Verify it loads in both weights used
      by marketing headings (light/medium) and body copy.

- [x] **WO-003 (0.3) — Pull the shadcn components the MVP actually needs**
      Use the shadcn MCP tools (`list_items_in_registries` / `get_add_command_for_items`)
      against the project's configured registry (`components.json`, style `base-nova`) to
      add the components the `/brand` page actually demos: input, label, textarea, select,
      checkbox, card, badge, separator, tooltip, dialog, dropdown-menu, sonner. Calendar,
      table, sidebar, avatar, popover, tabs, and skeleton stay deferred to the phases that
      need them — no near-term consumer yet, same discipline as the schema rule.

- [x] **WO-004 (0.4) — Build the `/brand` design system page**
      A living style guide, not a marketing page — this is the deliverable the rest of
      the team (and future-you) checks new UI against. Covers: color palette (every
      semantic token as a swatch, dark and light side by side), type scale (h1–h4, body,
      small/muted, with the class names used to produce them), spacing/radius boxes,
      buttons (every variant × size × state), form controls (input/select/checkbox/
      textarea in default/focus/error/disabled states), cards & elevation, an icon grid
      mapped from `data/data-amenities.ts`, and a live motion demo (dialog, dropdown,
      tooltip, toast). Internal tooling — no auth gate, not linked from public nav.
      Server-rendered except the small client leaf components the motion demo needs.
      _Depends on: WO-001, WO-002, WO-003._

- [x] **WO-005 (0.5) — Contrast and accessibility pass on the tokens**
      Every token pair's WCAG ratio computed programmatically (OKLab → linear sRGB →
      relative luminance), not eyeballed — see `app/globals.css` comments and the
      "A note on contrast" section on `/brand` for the numbers and the two decisions
      they drove: near-black (not white) text on gold, and a soft-tint-only convention
      for primary/destructive rather than solid fills, in dark mode.

- [x] **WO-006 (0.6) — Route path constants**
      Created `lib/routes.ts` with the full public + admin route table from spec §19 as
      a typed `APP_ROUTES` object per `02_CODING_GUIDELINES.md` §7.

---

## Phase 1 — Backend Foundation (Auth & Core Utilities)

`convex/schema.ts` does not exist yet and this phase does **not** create it wholesale.
The only schema touched here is the one field auth already needs today; every other
table (cabins, reservations, messages, …) is defined later, in the phase that actually
builds that feature.

- [x] **WO-007 (1.1) — Extend the auth user record with `role`**
      Add `role: "guest" | "admin"` to the Better Auth user schema and default new
      signups to `"guest"` (spec §9, §54). This is the one piece of data model that has
      to exist before Phase 2's auth pages and this phase's own authorization helpers —
      everything else waits for its feature. Confirm there is no client-writable path to
      set `role` on signup; check by reading the mutation, not by trusting the UI hides a
      field.
      _Depends on: nothing._

- [x] **WO-008 (1.2) — Authorization helpers**
      `requireUser` / `requireAdmin` helpers used at the top of every protected Convex
      function, per spec §9's authorization chain (Client → Admin UI → Mutation → Auth
      Check → Admin Check → DB). Reads the `role` field from WO-007; no new schema. No
      admin mutation ships without calling this.

- [x] **WO-009 (1.3) — Availability calculation (pure domain module)**
      `features/availability/availability-domain.ts`: given a cabin's capacity, a date
      range, and lists of reservation-shaped and availability-block-shaped inputs,
      return whether the range is bookable. Pure, framework-free, unit-tested against
      plain fixtures per spec §32 — deliberately built against typed inputs rather than
      Convex documents, since the `reservations` (Phase 5) and `availabilityBlocks`
      (Phase 8) tables don't exist yet. This is the single highest-priority test target
      called out in spec §11.

---

## Phase 2 — Authentication Pages

Better Auth + Convex wiring already exists (`convex/betterAuth/`, `app/api/auth/`).
This phase is the UI layer per spec §53–56. No new schema.

- [x] **WO-010 (2.1) — Auth layout shell**
      Shared split layout (photography + form) per spec §53, collapsing to single-column
      on mobile.

- [x] **WO-011 (2.2) — `/sign-up`** — first/last name, email, password, confirm password,
      terms acknowledgement. Client-side validation mirrored by backend validation
      (mirrored pure module pattern, `02_CODING_GUIDELINES.md` §7). Spec §54.

- [x] **WO-012 (2.3) — `/sign-in`** — email/password, forgot-password link, create-account
      link. Preserve booking-flow return context after successful auth per spec §34, §55.

- [ ] **WO-013 (2.4) — `/forgot-password`** + reset flow via Better Auth's supported
      recovery flow. Response must not leak whether an email exists (spec §56).

- [x] **WO-014 (2.5) — Protected route middleware/guards** for `/guest-area` and `/admin`,
      redirecting unauthenticated users to sign-in and unauthorized authenticated users
      to an appropriate unauthorized response (spec §57).

---

## Phase 3 — Public Site Shell

- [ ] **WO-015 (3.1) — Header** — logo, Home/Cabins/About/Contact nav, auth-aware right
      side (Sign In + Explore Cabins vs. Dashboard menu), minimal, transparent-over-hero
      variant. Spec §20. No schema.

- [ ] **WO-016 (3.2) — Footer** — branding, nav, legal links, newsletter form, copyright.
      Spec §21. No schema.

- [ ] **WO-017 (3.3) — Newsletter subscription** — defines the `subscribers` schema table
      (email, status, subscribedAt — spec §75) here, the first point anything needs it;
      footer/home form → mutation; graceful duplicate handling. Spec §50.

---

## Phase 4 — Cabin Discovery (Public)

No `cabins` or `amenities` tables exist before this phase — WO-018 defines them here,
against real display requirements, rather than guessing the shape back in Phase 1.

- [x] **WO-018 (4.1) — Define `cabins` + `amenities` schema, seed data**
      Field shapes per spec §69 (cabin: name, slug, descriptions, location, pricing,
      capacity, images, amenities, published, timestamps) and §72 (amenity: name, icon,
      category). Read `convex/_generated/ai/guidelines.md` first — it overrides
      training-data assumptions about Convex schema patterns. Also define the
      `AMENITY_CATEGORY` typed constant (`02_CODING_GUIDELINES.md` §7). Adapt the
      existing `data/data-cabins.ts`, `data/data-amenities.ts`, and `data/cabins/*.jpg`
      into a seed mutation/script so local dev has realistic cabins immediately — map
      legacy fields (`price_per_night`, `discount_percentage`, `beds`, `baths`) onto the
      new schema's `nightlyRate`/`bedrooms`/`bathrooms` naming rather than carrying old
      field names forward.
      _Depends on: nothing (parallel to Phases 1–3)._

- [x] **WO-019 (4.2) — Home page hero + marketing sections** — hero copy/CTA, "Escape the
      noise", "Built for slowing down", featured amenities, final CTA. Spec §22, §25.

- [x] **WO-020 (4.3) — Home availability search widget** — check-in/check-out/guests →
      redirects to `/cabins?checkIn=...&checkOut=...&guests=...`. Spec §23.

- [x] **WO-021 (4.4) — Featured cabins section** on home. Spec §24.

- [x] **WO-022 (4.5) — `/cabins` listing** — cards (cover image, name, location,
      capacity, beds/bedrooms, nightly price, description, amenities, view details),
      search controls (check-in/out/guests) plus optional max-price/amenity filters. No
      marketplace-grade filtering. Spec §26–27.

- [x] **WO-023 (4.6) — `/cabins/[slug]` detail page** — gallery, description, capacity,
      bed/bath counts, amenities (Lucide icons), pricing, availability, booking panel.
      Spec §28, §30.

- [x] **WO-024 (4.7) — Image gallery + lightbox** — large primary + secondary images on
      desktop, swipeable on mobile. Spec §29. Uses Next.js `Image` against Convex file
      storage.

---

## Phase 5 — Booking Flow

The spec (§41) requires the **demo booking flow to exist from day one** — it's not a
fallback bolted on after Stripe. Build it first; Stripe becomes an additive path. No
`reservations` or `featureFlags` tables exist before this point — WO-025 and WO-026
define them here.

- [x] **WO-025 (5.1) — Define `reservations` schema**
      Fields per spec §65–67: cabin ref, guest ref, check-in/check-out, guest count,
      reservation status, payment status, pricing snapshot (nightly subtotal, cleaning
      fee, taxes, total), `paymentRequired`, timestamps. Define `RESERVATION_STATUS` and
      `PAYMENT_STATUS` as typed constants alongside it (`02_CODING_GUIDELINES.md` §7).

- [x] **WO-026 (5.2) — Define `featureFlags` schema + `isFeatureEnabled` utility**
      Fields per spec §40 (key, name, description, enabled, updatedAt, updatedBy). Seed
      `stripePaymentsEnabled = false`. Centralized `isFeatureEnabled(key)` utility per
      spec §42 — feature code never queries the flags table ad hoc. Defaults to
      `disabled` when a flag can't be retrieved, which matters specifically for
      `stripePaymentsEnabled` since it gates payment creation.

- [x] **WO-027 (5.3) — Booking panel** (on cabin detail) — date range + guest count, live
      total calculation (nightly × nights + cleaning fee + taxes), backend availability
      validation before allowing checkout to proceed. Spec §31–32.

- [x] **WO-028 (5.4) — Auth gate at checkout entry** — unauthenticated users can configure
      a reservation freely; sign-in/sign-up is requested only when continuing to
      checkout, preserving booking context. Spec §33–34.

- [x] **WO-029 (5.5) — `/checkout/summary`** — cabin, dates, guests, pricing breakdown,
      guest info. Branches on `stripePaymentsEnabled`: "Pay & Confirm" (real flow) vs.
      "Confirm Reservation" with the disabled-payments notice (demo flow). Spec §35, §41.

- [x] **WO-030 (5.6) — Demo confirmation path** — creates a reservation with
      `paymentRequired: false`, `paymentStatus: "not_required"`, flag check enforced
      **server-side** in the mutation, not just hidden in the UI. Spec §41–42.

- [x] **WO-031 (5.7) — `/checkout/success`** — confirmation, reference, cabin, dates,
      total, link to dashboard. Spec §38.

- [x] **WO-032 (5.8) — `/checkout/cancel`** — cancellation messaging, return-to-cabin /
      retry actions, no reservation left in a confirmed state. Spec §39.

- [x] **WO-033 (5.9) — Reservation creation backend rules** — re-validates availability,
      guest-count ≤ capacity, no past check-in, no overlap with confirmed reservations
      or availability blocks — all server-side regardless of what the frontend showed.
      Wires WO-009's domain module against the real `reservations` table (blocks are
      wired in later, once WO-051 defines `availabilityBlocks`). Spec §32. Highest-
      priority test target per spec §11.

---

## Phase 6 — Guest Dashboard

Deliberately small — spec §43 is explicit that this should not become a second admin
dashboard. No new schema; reads/writes the `reservations` table from Phase 5.

- [x] **WO-034 (6.1) — `/guest-area` layout** — lightweight sidebar (Overview/Bookings/
      Profile/Logout), collapses to mobile nav. Spec §43.

- [x] **WO-035 (6.2) — Overview** — welcome message, upcoming stay card, recent bookings,
      useful empty state for zero-reservation guests. No filler metrics. Spec §44.

- [x] **WO-036 (6.3) — Bookings list** — reference, cabin, dates, guests, total,
      statuses; grouped Upcoming/Past/Cancelled. Detail view as page/drawer/dialog.
      Spec §45.

- [x] **WO-037 (6.4) — Profile** — view/edit first/last name, phone (optional); email
      read-only for MVP unless Better Auth's verified-change flow is trivial to wire.
      Spec §46.

- [x] **WO-038 (6.5) — Reservation cancellation** — self-cancel only outside a
      `cancellationWindowHours` window; start with this as a hardcoded constant (48h per
      spec §47) rather than a DB setting — WO-057 promotes it to admin-configurable only
      if/when that's actually needed. Paid reservations require admin intervention if
      refunds aren't implemented; demo reservations cancel directly when policy allows.
      UI must not conflate "cancel" with "request a refund".

---

## Phase 7 — Content & Compliance Pages

Placed before the admin dashboard: the admin messages screen (Phase 8) reads data this
phase's contact form produces, so the `messages` table is modeled here, against the form
that actually writes it.

- [x] **WO-039 (7.1) — `/about`** — story, philosophy, cabin experience, sustainability
      angle, photography, CTA. Spec §48. No schema.

- [x] **WO-040 (7.2) — `/contact`** — defines the `messages` schema table here (name,
      email, subject, message, status, createdAt — spec §74) and the `MESSAGE_STATUS`
      typed constant, since this form is the first and only writer. Mutation, success
      state, server-side validation, honeypot field, basic rate limiting. Spec §49.

- [x] **WO-041 (7.3) — `/privacy`** — demo-appropriate policy covering the sections in
      spec §51, naming Stripe as external processor where relevant. No false compliance
      claims. No schema.

- [x] **WO-042 (7.4) — `/terms`** — demo-appropriate terms per spec §52 sections. No
      schema.

---

## Phase 8 — Admin Dashboard

Route-gated to `role: "admin"` end to end (WO-008). Comes after Phases 3–7 rather than
right after booking, because almost every admin screen surfaces data those phases
already produce (cabins, reservations, messages, subscribers) — there's nothing left to
model speculatively by the time this phase starts. Spec §57–79.

- [ ] **WO-043 (8.1) — `/admin` layout** — sidebar nav (Home/Bookings/Cabins/Messages/
      Users/Subscribers/Feature Flags/Settings) with Lucide icons, active-section
      indicator, desktop-oriented but usable on tablet, functional on mobile. Spec §58.

- [ ] **WO-044 (8.2) — Admin home / KPIs** — total bookings, upcoming reservations,
      revenue (paid only — demo reservations must not count), occupancy, unread
      messages. Trim the set if a metric adds disproportionate complexity. Reads
      `reservations` (WO-025) and `messages` (WO-040); no new schema. Spec §59–60.

- [ ] **WO-045 (8.3) — Admin recent bookings + basic analytics** — bookings-over-time,
      revenue-over-time (paid only), reservations-by-cabin. Computed directly from
      operational data, no analytics warehouse. Spec §61–62.

- [ ] **WO-046 (8.4) — `/admin/bookings` table** — reference, guest, cabin, dates,
      guests, statuses, total, created, actions; filters for search/status/payment/
      cabin/date range. Spec §63–64.

- [ ] **WO-047 (8.5) — Booking detail view** — reservation/guest/stay/financial sections,
      cancel action, status view, links to guest/cabin. No arbitrary post-payment
      financial edits. Spec §67.

- [ ] **WO-048 (8.6) — `/admin/cabins` CRUD** — list, create, edit, publish/unpublish (no
      hard delete once a cabin has reservation history), amenities assignment, pricing,
      capacity — against the `cabins`/`amenities` schema from WO-018. Spec §68–69, §72.

- [ ] **WO-049 (8.7) — Cabin image management** — upload/remove/reorder gallery, cover
      image selection, via Convex file storage. Spec §71.

- [ ] **WO-050 (8.8) — Cabin slug handling** — uniqueness enforced backend-side; no
      redirect history needed for MVP. Spec §70.

- [ ] **WO-051 (8.9) — Availability blocks** — defines the `availabilityBlocks` schema
      table here (cabinId, startDate, endDate, reason, createdBy, createdAt — spec §73),
      the first feature that needs it. Admin creates/removes blocks (maintenance,
      private use, etc.); wire this table into the availability domain module (WO-009)
      alongside the confirmed-reservations check from WO-033.

- [ ] **WO-052 (8.10) — `/admin/messages`** — list, mark read/unread, archive; reads the
      `messages` table defined in WO-040. No inbox/reply UI. Spec §74.

- [ ] **WO-053 (8.11) — `/admin/subscribers`** — list, search, view status, unsubscribe/
      remove; reads the `subscribers` table defined in WO-017. No newsletter-sending UI.
      Spec §75.

- [ ] **WO-054 (8.12) — `/admin/users`** — list (name, email, role, registered, booking
      count), search/role filter, user detail with reservation history. No role-change
      UI in this pass — keep role assignment out of band per spec §77. No new schema.

- [ ] **WO-055 (8.13) — `/admin/feature-flags`** — list flags with toggle, confirmation
      dialog for consequential flags (Stripe), last-updated-by line; reads/writes the
      `featureFlags` table from WO-026. Spec §78.

- [ ] **WO-056 (8.14) — Feature flag audit trail** — confirm every toggle sets
      `updatedAt`/`updatedBy` on the flag row itself (already part of the WO-026 schema
      per spec §40 — this task proves it's wired, it doesn't add a table). Only
      introduce a dedicated audit-log table if a broader cross-entity action log turns
      out to be genuinely needed later — don't build one speculatively (spec §4).

- [ ] **WO-057 (8.15) — `/admin/settings`** — defines the minimal settings schema needed
      at this point (e.g. a single-row `appSettings` table holding
      `cancellationWindowHours`, promoting the hardcoded constant from WO-038 to
      admin-configurable) and only for values something already reads — don't add
      settings fields with no consumer yet.

---

## Phase 9 — Stripe Integration (flagged)

Only reachable when `stripePaymentsEnabled = true`. Build after the demo flow (Phase 5)
is solid, since the demo flow is the one that must always work.

- [ ] **WO-058 (9.1) — Stripe Checkout session creation** — server-side, triggered from
      `/checkout/summary` "Pay & Confirm"; flag re-checked in the mutation itself.
      Extends the `reservations` schema from WO-025 with a Stripe session/reference
      field here, when the integration that needs it is actually being built. Spec §36,
      §41–42.

- [ ] **WO-059 (9.2) — Webhook handler** — idempotent processing of Stripe events,
      transitions reservation `paymentStatus` (`pending → paid/failed`) and
      `reservationStatus` accordingly. Browser redirect alone is never treated as proof
      of payment. Spec §37.

- [ ] **WO-060 (9.3) — Reservation states from webhook** — confirm the reservation only
      on the authoritative webhook event, not on Checkout redirect.

---

## Phase 10 — Testing & Hardening

Ongoing per-phase, but this phase is the pass that closes gaps before calling the MVP
done. Priority areas straight from spec §11.

- [ ] **WO-061 (10.1) — Reservation date validation tests** (WO-009 domain module).

- [ ] **WO-062 (10.2) — Availability calculation + booking conflict tests** —
      overlapping confirmed reservations, availability blocks, boundary dates.

- [ ] **WO-063 (10.3) — Pricing calculation tests** — nightly × nights + fees + taxes,
      including rounding rule (see `02_CODING_GUIDELINES.md` §7 on money — integer minor
      units, never floats).

- [ ] **WO-064 (10.4) — Auth-dependent behavior tests** — protected routes, protected
      mutations.

- [ ] **WO-065 (10.5) — Admin authorization tests** — non-admin calling an admin
      mutation is rejected server-side, not just hidden client-side.

- [ ] **WO-066 (10.6) — Feature flag tests** — `stripePaymentsEnabled` true/false paths,
      and the fail-closed default when the flag can't be read.

- [ ] **WO-067 (10.7) — Payment-disabled booking behavior tests** — demo reservation
      never ends up looking like a paid Stripe reservation.

- [ ] **WO-068 (10.8) — Critical form tests** — sign-up, sign-in, contact form, booking
      panel.

- [ ] **WO-069 (10.9) — Accessibility pass** — keyboard nav, focus states, form labels,
      dialog a11y, contrast, alt text, across public site, dashboard, and admin. Spec §18.

- [ ] **WO-070 (10.10) — Responsive pass** — mobile/tablet/desktop/large-desktop on
      public site; admin tables adapt (horizontal scroll / responsive columns / card
      view) on small screens. Spec §17.

- [ ] **WO-071 (10.11) — E2E smoke tests** (Playwright) — sign-up → browse → demo
      booking → dashboard; admin login → cabins CRUD → booking visibility.

- [ ] **WO-072 (10.12) — Full quality gate** — `bun run check && bun run typecheck &&
bun run test && bun run build`, plus `bun run test:e2e` since routing/layout/
      rendered output are all touched by this point.

---

## Explicitly deferred (see spec §4)

Not tasks for this list — do not build infrastructure for these speculatively:
multi-property owners, marketplace sync, dynamic pricing, tax engines, loyalty/gift
cards, multi-currency/language, native apps, staff/housekeeping/maintenance tooling,
accounting integrations, full CMS, enterprise RBAC, BI/reporting, complex refunds/split
payments, multiple payment processors.
