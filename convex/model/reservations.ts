import { ConvexError } from 'convex/values';

import {
    type AvailabilityResult,
    checkAvailability as checkAvailabilityDomain,
    type ExistingReservationLike,
} from '../../features/availability/availability-domain';
import { todayIsoDate } from '../../lib/dates';
import { nightsBetween } from '../../lib/pricing';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { authComponent } from '../betterAuth/auth';
import { type CancellationDenialReason, canSelfCancel } from '../lib/cancellation';
import { MESSAGE_STATUS } from '../lib/messages';
import { assertIntegerCents } from '../lib/money';
import { calculateOccupancy, occupancyWindowStart } from '../lib/occupancy';
import {
    isBlockingStatus,
    PAYMENT_STATUS,
    type PaymentStatus,
    RESERVATION_STATUS,
    type ReservationStatus,
} from '../lib/reservations';
import { getAppSettings } from './appSettings';
import { requireAdmin, requireUser } from './auth';
import { loadActiveBlocks } from './availabilityBlocks';
import { isFeatureEnabled } from './featureFlags';

// Generous bound, same reasoning as cabins.ts's LISTING_RESULT_CAP -- never `.collect()`
// unbounded, `.take()` instead. A single cabin accumulating this many pending/confirmed
// reservations at once is far beyond this app's scale.
const BLOCKING_RESERVATIONS_CAP = 500;

// Derived from `isBlockingStatus` rather than hardcoded, so a future blocking status can't
// silently fall out of sync with the one query that actually fetches blocking reservations.
const BLOCKING_STATUSES = Object.values(RESERVATION_STATUS).filter(isBlockingStatus);

async function loadBlockingReservations(
    ctx: QueryCtx,
    cabinId: Id<'cabins'>,
): Promise<ExistingReservationLike[]> {
    const byStatus = await Promise.all(
        BLOCKING_STATUSES.map((status) =>
            ctx.db
                .query('reservations')
                .withIndex('by_cabinId_and_status', (q) =>
                    q.eq('cabinId', cabinId).eq('status', status),
                )
                .take(BLOCKING_RESERVATIONS_CAP),
        ),
    );

    return byStatus.flat().map((reservation) => ({
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: reservation.status,
    }));
}

/**
 * Shared by the public `checkAvailability` query and `createDemoReservation`'s pre-insert
 * re-check -- fetches the cabin once and runs the pure domain check against it, so a caller
 * that also needs the cabin doc (e.g. for pricing) doesn't have to fetch it a second time.
 */
async function resolveAvailability(
    ctx: QueryCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number; now: string },
): Promise<{ cabin: Doc<'cabins'>; result: AvailabilityResult }> {
    const [cabin, existingReservations, blocks] = await Promise.all([
        ctx.db.get(args.cabinId),
        loadBlockingReservations(ctx, args.cabinId),
        loadActiveBlocks(ctx, args.cabinId),
    ]);

    // Same reasoning as cabins.ts's getBySlug: an unauthenticated public query must never leak
    // the existence or availability of a draft/unpublished cabin. One error for "missing" and
    // "unpublished" alike, so a caller can't distinguish the two.
    if (!cabin || !cabin.published) {
        throw new ConvexError(`Unknown cabin id "${args.cabinId}".`);
    }

    const result = checkAvailabilityDomain({
        range: { checkIn: args.checkIn, checkOut: args.checkOut },
        guests: args.guests,
        capacity: cabin.maxGuests,
        now: args.now,
        existingReservations,
        blocks,
    });

    return { cabin, result };
}

/**
 * Server-side, authoritative availability check (spec §32) -- backs the live client-side check
 * the booking panel calls on every date/guest change. `now` is supplied by the caller rather
 * than read here, so this stays safe to call from a `query` (never read `Date.now()` inside
 * one). `createDemoReservation`'s own pre-insert re-check derives its own `now` server-side
 * instead of trusting this argument -- a client-supplied `now` is only trustworthy for this
 * query's live-preview purpose, never for an authoritative check that must not be spoofable
 * into skipping a real overlap.
 */
export async function checkAvailability(
    ctx: QueryCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number; now: string },
) {
    const { result } = await resolveAvailability(ctx, args);
    return result;
}

/**
 * Creates a reservation via the demo (no-payment) path (spec §41). Every input is re-derived
 * or re-validated server-side -- the client's earlier live availability check and total are
 * never trusted, per docs/02_CODING_GUIDELINES.md §14.
 */
export async function createDemoReservation(
    ctx: MutationCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number },
) {
    const user = await requireUser(ctx);

    // WO-030's core requirement: the demo path is disabled server-side whenever Stripe is
    // enabled, not merely hidden behind a disabled button in the UI.
    if (await isFeatureEnabled(ctx, 'stripePaymentsEnabled')) {
        throw new ConvexError('Demo confirmation is unavailable while payments are enabled.');
    }

    const { cabin, result } = await resolveAvailability(ctx, {
        ...args,
        now: todayIsoDate(),
    });

    if (!result.available) {
        throw new ConvexError('These dates are no longer available.');
    }

    const nights = nightsBetween(args.checkIn, args.checkOut);
    const nightlySubtotal = cabin.nightlyRate * nights;
    const taxes = 0; // No tax engine exists yet (spec §4).
    const total = nightlySubtotal + cabin.cleaningFee + taxes;

    assertIntegerCents(nightlySubtotal, 'nightlySubtotal');
    assertIntegerCents(total, 'total');

    const timestamp = Date.now();

    const reservationId = await ctx.db.insert('reservations', {
        cabinId: args.cabinId,
        guestId: user._id,
        checkIn: args.checkIn,
        checkOut: args.checkOut,
        guests: args.guests,
        status: RESERVATION_STATUS.CONFIRMED,
        paymentStatus: PAYMENT_STATUS.NOT_REQUIRED,
        paymentRequired: false,
        pricing: { nightlySubtotal, cleaningFee: cabin.cleaningFee, taxes, total },
        createdAt: timestamp,
        updatedAt: timestamp,
    });

    return { reservationId };
}

/**
 * Creates a reservation via the Stripe payment path (WO-058, spec §41's `stripePaymentsEnabled
 * = true` branch) -- the inverse gate of `createDemoReservation`'s. Same re-validation
 * discipline (re-check availability, re-derive pricing server-side, `assertIntegerCents`), but
 * inserts as `PENDING`/`PENDING` rather than `CONFIRMED`/`NOT_REQUIRED`: `PENDING` is already a
 * blocking status (`isBlockingStatus`), so this holds the calendar slot while the guest is on
 * Stripe's Checkout page. The reservation only ever becomes `CONFIRMED` via the webhook
 * (`applyStripeWebhookTransition`) -- never here, per spec §37's "redirect is never proof of
 * payment."
 */
export async function createPendingStripeReservation(
    ctx: MutationCtx,
    args: { cabinId: Id<'cabins'>; checkIn: string; checkOut: string; guests: number },
) {
    const user = await requireUser(ctx);

    // The mirror image of createDemoReservation's gate: the Stripe path must never create a
    // reservation while payments are disabled, even if a client somehow reaches this mutation.
    if (!(await isFeatureEnabled(ctx, 'stripePaymentsEnabled'))) {
        throw new ConvexError('Stripe payments are not currently enabled.');
    }

    const { cabin, result } = await resolveAvailability(ctx, {
        ...args,
        now: todayIsoDate(),
    });

    if (!result.available) {
        throw new ConvexError('These dates are no longer available.');
    }

    const nights = nightsBetween(args.checkIn, args.checkOut);
    const nightlySubtotal = cabin.nightlyRate * nights;
    const taxes = 0; // No tax engine exists yet (spec §4).
    const total = nightlySubtotal + cabin.cleaningFee + taxes;

    assertIntegerCents(nightlySubtotal, 'nightlySubtotal');
    assertIntegerCents(total, 'total');

    const timestamp = Date.now();
    const pricing = { nightlySubtotal, cleaningFee: cabin.cleaningFee, taxes, total };

    const reservationId = await ctx.db.insert('reservations', {
        cabinId: args.cabinId,
        guestId: user._id,
        checkIn: args.checkIn,
        checkOut: args.checkOut,
        guests: args.guests,
        status: RESERVATION_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        paymentRequired: true,
        pricing,
        createdAt: timestamp,
        updatedAt: timestamp,
    });

    return { reservationId, pricing };
}

/**
 * Patches on the Stripe Checkout Session id once it exists -- the session can only be created
 * (via the Stripe API, inside an action) after the reservation row above already exists, so
 * this is always a second, separate write.
 */
export async function attachStripeSessionId(
    ctx: MutationCtx,
    args: { reservationId: Id<'reservations'>; stripeCheckoutSessionId: string },
) {
    await ctx.db.patch(args.reservationId, {
        stripeCheckoutSessionId: args.stripeCheckoutSessionId,
        updatedAt: Date.now(),
    });
}

// A reservation already in one of these paymentStatus/status combinations has already been
// resolved by an earlier webhook delivery -- any further transition is a no-op. This is the
// actual idempotency guard for WO-059: Stripe explicitly warns webhook events can be
// redelivered, so a duplicate `checkout.session.completed` must never double-process.
const TERMINAL_PAYMENT_STATUSES: PaymentStatus[] = [
    PAYMENT_STATUS.PAID,
    PAYMENT_STATUS.FAILED,
    PAYMENT_STATUS.REFUNDED,
];

/**
 * Applies a Stripe webhook-driven state transition to the reservation matching
 * `stripeCheckoutSessionId` (WO-059, WO-060) -- the sole place a reservation ever becomes
 * `CONFIRMED`/`PAID` via Stripe. Called only from the `/stripe/webhook` httpAction, via an
 * internal mutation, never directly from the client (spec §37: a browser redirect alone is
 * never proof of payment).
 */
export async function applyStripeWebhookTransition(
    ctx: MutationCtx,
    args: {
        stripeCheckoutSessionId: string;
        paymentIntentId?: string;
        transition: 'paid' | 'failed' | 'expired';
    },
) {
    const reservation = await ctx.db
        .query('reservations')
        .withIndex('by_stripeCheckoutSessionId', (q) =>
            q.eq('stripeCheckoutSessionId', args.stripeCheckoutSessionId),
        )
        .unique();

    // Unknown session id (e.g. test-mode noise, or an event for a session this deployment
    // never created) -- ignore rather than throw, so the webhook still returns 200 and Stripe
    // doesn't retry an event this app was never going to act on.
    if (!reservation) return;

    // Idempotency guard: a reservation already cancelled, or already in a terminal payment
    // state, has already been resolved by an earlier delivery of this (or a conflicting)
    // event -- re-applying would either be a no-op or actively wrong (e.g. re-confirming a
    // reservation the guest already cancelled).
    if (
        reservation.status === RESERVATION_STATUS.CANCELLED ||
        TERMINAL_PAYMENT_STATUSES.includes(reservation.paymentStatus)
    ) {
        return;
    }

    const updatedAt = Date.now();

    if (args.transition === 'paid') {
        await ctx.db.patch(reservation._id, {
            status: RESERVATION_STATUS.CONFIRMED,
            paymentStatus: PAYMENT_STATUS.PAID,
            stripePaymentIntentId: args.paymentIntentId,
            updatedAt,
        });
        return;
    }

    // 'failed' and 'expired' both vacate the calendar hold -- this app's Checkout Sessions are
    // single-attempt, so there's no in-place retry to wait for.
    await ctx.db.patch(reservation._id, {
        status: RESERVATION_STATUS.CANCELLED,
        paymentStatus: PAYMENT_STATUS.FAILED,
        updatedAt,
    });
}

// Generous bound, same reasoning as BLOCKING_RESERVATIONS_CAP -- a guest's own booking
// history is small; `.take()` with a cap is simpler than pagination at this scale.
const OWN_RESERVATIONS_CAP = 200;

/**
 * All of a guest's own reservations (most recent first), for the guest dashboard's
 * Overview and Bookings screens (Phase 6). No server-side status/date filtering --
 * grouping into Upcoming/Past/Cancelled is a pure client-side concern (see
 * features/guest-area/reservations-grouping.ts), so this one query backs both screens
 * instead of near-duplicate queries.
 */
export async function listOwnReservations(ctx: QueryCtx) {
    const user = await requireUser(ctx);

    const reservations = await ctx.db
        .query('reservations')
        .withIndex('by_guestId', (q) => q.eq('guestId', user._id))
        .order('desc')
        .take(OWN_RESERVATIONS_CAP);

    // Resolve each distinct cabin once, not once per reservation -- a guest with several
    // stays at the same cabin would otherwise pay for the same doc + storage-url lookup
    // repeatedly.
    const uniqueCabinIds = [...new Set(reservations.map((reservation) => reservation.cabinId))];
    const cabinsById = new Map(
        await Promise.all(
            uniqueCabinIds.map(async (cabinId) => {
                const cabin = await ctx.db.get(cabinId);
                const coverImageUrl = cabin ? await ctx.storage.getUrl(cabin.coverImage) : null;
                return [cabinId, { cabin, coverImageUrl }] as const;
            }),
        ),
    );

    return reservations.map((reservation) => {
        const { cabin, coverImageUrl } = cabinsById.get(reservation.cabinId) ?? {
            cabin: null,
            coverImageUrl: null,
        };

        return {
            _id: reservation._id,
            cabinName: cabin?.name ?? 'Unknown cabin',
            cabinSlug: cabin?.slug ?? null,
            coverImageUrl,
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            guests: reservation.guests,
            status: reservation.status,
            paymentStatus: reservation.paymentStatus,
            paymentRequired: reservation.paymentRequired,
            pricing: reservation.pricing,
            createdAt: reservation.createdAt,
        };
    });
}

/**
 * A guest's own reservation, for the checkout success page (spec §38) and later the guest
 * dashboard (Phase 6). Authorization is ownership, not just "signed in": `null` for a
 * reservation that exists but belongs to someone else, same as "doesn't exist" -- the caller
 * can't distinguish the two, so this never leaks another guest's booking.
 *
 * Takes the id as a plain string and normalizes it rather than validating as `v.id(...)` at the
 * boundary -- this is read from a URL query param (stale bookmark, manually edited, bot
 * crawler), so a malformed value is an expected "not found" case, not a 500.
 */
export async function getOwnReservation(ctx: QueryCtx, args: { reservationId: string }) {
    const user = await requireUser(ctx);
    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;

    if (!reservation || reservation.guestId !== user._id) return null;

    const cabin = await ctx.db.get(reservation.cabinId);

    return {
        _id: reservation._id,
        cabinName: cabin?.name ?? 'Unknown cabin',
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        pricing: reservation.pricing,
        createdAt: reservation.createdAt,
    };
}

const CANCELLATION_DENIAL_MESSAGES: Record<CancellationDenialReason, string> = {
    'already-cancelled': 'This reservation has already been cancelled.',
    'not-upcoming': 'Only upcoming reservations can be cancelled.',
    'within-window': 'Cancellation is only available more than 48 hours before check-in.',
    'requires-admin': 'This reservation requires admin assistance to cancel.',
};

/**
 * Self-service cancellation (spec §47), gated by the guest's ownership and the 48h window
 * enforced in `canSelfCancel`. Patches `status` only -- never `paymentStatus`. Cancelling a
 * reservation and refunding a payment are explicitly distinct operations (spec §47); this
 * mutation only ever does the former. A future refund action would be a separate, its own
 * server-side operation, not a side effect of cancellation.
 */
export async function cancelReservation(ctx: MutationCtx, args: { reservationId: string }) {
    const user = await requireUser(ctx);
    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;

    if (!reservation || reservation.guestId !== user._id) {
        throw new ConvexError('Unknown reservation.');
    }

    const { cancellationWindowHours } = await getAppSettings(ctx);

    const check = canSelfCancel({
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: reservation.status,
        paymentRequired: reservation.paymentRequired,
        now: new Date(Date.now()),
        windowHours: cancellationWindowHours,
    });

    if (!check.allowed) {
        throw new ConvexError(CANCELLATION_DENIAL_MESSAGES[check.reason]);
    }

    await ctx.db.patch(reservation._id, {
        status: RESERVATION_STATUS.CANCELLED,
        updatedAt: Date.now(),
    });

    return null;
}

// Generous bound for the stats query's in-memory aggregation -- same "capped, not true
// unbounded `.collect()`" discipline as everywhere else in this file. Every number this query
// returns is only as accurate as this cap; fine for this app's current scale, a real
// aggregation strategy (e.g. a rollup table) would be the follow-up if it's ever exceeded.
const STATS_RESERVATIONS_CAP = 2000;

// Same capped-count discipline as `LISTING_RESULT_CAP` in cabins.ts -- Convex has no built-in
// count operator (convex/_generated/ai/guidelines.md), and a denormalized counter isn't worth
// the mutation-side upkeep for a business at this app's scale. A bounded `.take().length`
// avoids the true unbounded-scan risk the guideline is warning about, at the cost of these
// counts silently reading low if either table ever grows past the cap.
const CABIN_COUNT_CAP = 500;
const UNREAD_MESSAGE_COUNT_CAP = 500;

const RECENT_BOOKINGS_LIMIT = 5;

const OCCUPANCY_COUNTING_STATUSES: ReservationStatus[] = [
    RESERVATION_STATUS.CONFIRMED,
    RESERVATION_STATUS.COMPLETED,
];

function isoDateRange(windowStart: string, windowEnd: string): string[] {
    const dates: string[] = [];
    const cursor = new Date(`${windowStart}T00:00:00`);
    const end = new Date(`${windowEnd}T00:00:00`);

    while (cursor < end) {
        dates.push(todayIsoDate(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
}

async function resolveCabinsById(ctx: QueryCtx, cabinIds: Id<'cabins'>[]) {
    return new Map(
        await Promise.all(
            [...new Set(cabinIds)].map(
                async (cabinId) => [cabinId, await ctx.db.get(cabinId)] as const,
            ),
        ),
    );
}

/**
 * Pre-aggregated KPI/analytics numbers for the admin home (WO-044/WO-045) -- a separate query
 * from `adminListReservations` on purpose: this wants every reservation in the reporting
 * window collapsed into sums/buckets server-side, while the bookings table wants a page of
 * full rows with arbitrary filters. Forcing one shape to serve both would waste work either
 * way. `now` is caller-supplied (never read here), same discipline as `checkAvailability`.
 *
 * Two different notions of "in the window" are used deliberately: occupancy is about which
 * *nights* were occupied, so it filters by stay dates (`checkIn`/`checkOut`) overlapping the
 * window. Everything else (revenue, the two "over time" charts, reservations-by-cabin) is
 * about booking *activity*, so it filters by `createdAt` falling inside the window instead --
 * a reservation created last month for a stay next week doesn't belong on a "last 30 days of
 * bookings" chart, and a reservation created yesterday for a stay 6 months out does.
 */
export async function adminGetStats(ctx: QueryCtx, args: { now: string }) {
    await requireAdmin(ctx);

    const windowStart = occupancyWindowStart(args.now);
    const windowEnd = args.now;
    const windowStartMs = new Date(`${windowStart}T00:00:00`).getTime();
    const windowEndMs = new Date(`${windowEnd}T00:00:00`).getTime();

    const [reservations, publishedCabins, unreadMessages] = await Promise.all([
        ctx.db.query('reservations').order('desc').take(STATS_RESERVATIONS_CAP),
        ctx.db
            .query('cabins')
            .withIndex('by_published_and_featured', (q) => q.eq('published', true))
            .take(CABIN_COUNT_CAP),
        ctx.db
            .query('messages')
            .withIndex('by_status', (q) => q.eq('status', MESSAGE_STATUS.UNREAD))
            .take(UNREAD_MESSAGE_COUNT_CAP),
    ]);
    const publishedCabinCount = publishedCabins.length;

    const cabinsById = await resolveCabinsById(
        ctx,
        reservations.map((reservation) => reservation.cabinId),
    );

    const totalBookings = reservations.length;

    // Matches `features/guest-area/reservations-grouping.ts`'s "upcoming" definition:
    // `checkOut > now`, not `checkIn` -- a currently-in-progress stay is still upcoming.
    const upcomingReservations = reservations.filter(
        (reservation) => reservation.checkOut > args.now && isBlockingStatus(reservation.status),
    ).length;

    const notCancelled = (reservation: Doc<'reservations'>) =>
        reservation.status !== RESERVATION_STATUS.CANCELLED;

    const reservationsCreatedInWindow = reservations.filter(
        (reservation) =>
            reservation.createdAt >= windowStartMs && reservation.createdAt < windowEndMs,
    );

    const isPaid = (reservation: Doc<'reservations'>) =>
        reservation.paymentRequired && reservation.paymentStatus === PAYMENT_STATUS.PAID;

    const revenueCents = reservationsCreatedInWindow
        .filter(notCancelled)
        .filter(isPaid)
        .reduce((sum, reservation) => sum + reservation.pricing.total, 0);

    const occupancy = calculateOccupancy({
        publishedCabinCount,
        reservations: reservations.filter(
            (reservation) =>
                OCCUPANCY_COUNTING_STATUSES.includes(reservation.status) &&
                reservation.checkOut > windowStart &&
                reservation.checkIn < windowEnd,
        ),
        windowStart,
        windowEnd,
    });

    const dateBuckets = isoDateRange(windowStart, windowEnd);
    const bookingsByDate = new Map(dateBuckets.map((date) => [date, 0]));
    const revenueByDate = new Map(dateBuckets.map((date) => [date, 0]));

    for (const reservation of reservationsCreatedInWindow.filter(notCancelled)) {
        const key = todayIsoDate(new Date(reservation.createdAt));

        if (bookingsByDate.has(key)) {
            bookingsByDate.set(key, bookingsByDate.get(key)! + 1);
        }
        if (revenueByDate.has(key) && isPaid(reservation)) {
            revenueByDate.set(key, revenueByDate.get(key)! + reservation.pricing.total);
        }
    }

    // Grouped by `cabinId`, not name -- two cabins can share a display name, and collapsing
    // by name would silently merge their counts.
    const reservationsByCabinIdMap = new Map<Id<'cabins'>, number>();
    for (const reservation of reservationsCreatedInWindow.filter(notCancelled)) {
        reservationsByCabinIdMap.set(
            reservation.cabinId,
            (reservationsByCabinIdMap.get(reservation.cabinId) ?? 0) + 1,
        );
    }

    const recentBookings = await Promise.all(
        reservations.slice(0, RECENT_BOOKINGS_LIMIT).map(async (reservation) => {
            const guest = await resolveGuestSummary(ctx, reservation.guestId);
            return {
                _id: reservation._id,
                cabinName: cabinsById.get(reservation.cabinId)?.name ?? 'Unknown cabin',
                guestName: guest.name,
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                status: reservation.status,
                total: reservation.pricing.total,
                createdAt: reservation.createdAt,
            };
        }),
    );

    return {
        totalBookings,
        upcomingReservations,
        revenueCents,
        occupancy,
        unreadMessages: unreadMessages.length,
        bookingsOverTime: dateBuckets.map((date) => ({ date, count: bookingsByDate.get(date)! })),
        revenueOverTime: dateBuckets.map((date) => ({ date, cents: revenueByDate.get(date)! })),
        reservationsByCabin: [...reservationsByCabinIdMap.entries()].map(([cabinId, count]) => ({
            cabinName: cabinsById.get(cabinId)?.name ?? 'Unknown cabin',
            count,
        })),
        recentBookings,
    };
}

// Generous bound, same reasoning as cabins.ts's listFiltered -- not true infinite-scale
// pagination, a capped `.take()` narrowed in JS. Fine as long as the business's total
// reservation count stays under this; real cursor pagination is a follow-up if it doesn't.
// Note this cap is applied BEFORE the free-text `search` filter below (cabinId/status ARE
// pushed into the index first, so those two filters don't suffer this) -- a guest whose
// reservation falls outside the most-recent `ADMIN_LISTING_RESULT_CAP` rows won't surface via
// search. Acceptable for this app's current scale; the real fix if it's ever hit is a
// dedicated search index, not a bigger cap.
const ADMIN_LISTING_RESULT_CAP = 500;

async function resolveGuestSummary(ctx: QueryCtx, guestId: string) {
    const user = await authComponent.getAnyUserById(ctx, guestId);
    return { name: user?.name ?? 'Unknown guest', email: user?.email ?? 'unknown' };
}

/**
 * All reservations across every guest, for the admin bookings table (spec §61/§75, WO-046).
 * Narrows by `cabinId`/`status` via the existing `by_cabinId_and_status` index when both are
 * supplied; otherwise reads the capped, most-recent-first set and filters the rest in JS --
 * guest name/email live in the Better Auth component, not this table, so free-text `search`
 * can never be pushed into a Convex index here.
 */
export async function adminListReservations(
    ctx: QueryCtx,
    args: {
        search?: string;
        status?: ReservationStatus;
        paymentStatus?: PaymentStatus;
        cabinId?: Id<'cabins'>;
        checkInFrom?: string;
        checkInTo?: string;
    },
) {
    await requireAdmin(ctx);

    const { cabinId, status } = args;

    // `by_cabinId_and_status` supports either the full compound key or just its `cabinId`
    // prefix (a query may supply any prefix of a compound index) -- use it whenever `cabinId`
    // is present instead of only when both filters are, so a cabin-only filter doesn't fall
    // back to scanning every reservation in the business.
    const reservations = cabinId
        ? await ctx.db
              .query('reservations')
              .withIndex('by_cabinId_and_status', (q) =>
                  status ? q.eq('cabinId', cabinId).eq('status', status) : q.eq('cabinId', cabinId),
              )
              .order('desc')
              .take(ADMIN_LISTING_RESULT_CAP)
        : await ctx.db.query('reservations').order('desc').take(ADMIN_LISTING_RESULT_CAP);

    const cabinsById = await resolveCabinsById(
        ctx,
        reservations.map((reservation) => reservation.cabinId),
    );

    const uniqueGuestIds = [...new Set(reservations.map((reservation) => reservation.guestId))];
    const guestsById = new Map(
        await Promise.all(
            uniqueGuestIds.map(
                async (guestId) => [guestId, await resolveGuestSummary(ctx, guestId)] as const,
            ),
        ),
    );

    const normalizedSearch = args.search?.trim().toLowerCase();

    const rows = reservations
        .filter((reservation) => !args.cabinId || reservation.cabinId === args.cabinId)
        .filter((reservation) => !args.status || reservation.status === args.status)
        .filter(
            (reservation) =>
                !args.paymentStatus || reservation.paymentStatus === args.paymentStatus,
        )
        .filter((reservation) => !args.checkInFrom || reservation.checkIn >= args.checkInFrom)
        .filter((reservation) => !args.checkInTo || reservation.checkIn <= args.checkInTo)
        .map((reservation) => {
            const cabin = cabinsById.get(reservation.cabinId) ?? null;
            // Never actually missing -- `guestsById` is built from this same reservations
            // array's guest ids, and `resolveGuestSummary` already has its own fallback for
            // an unresolvable Better Auth user. `!` documents that, rather than a `??` that
            // would silently paper over a real bug if this invariant ever broke.
            const guest = guestsById.get(reservation.guestId)!;

            return {
                _id: reservation._id,
                cabinName: cabin?.name ?? 'Unknown cabin',
                guestName: guest.name,
                guestEmail: guest.email,
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                guests: reservation.guests,
                status: reservation.status,
                paymentStatus: reservation.paymentStatus,
                total: reservation.pricing.total,
                createdAt: reservation.createdAt,
            };
        })
        .filter((row) => {
            if (!normalizedSearch) return true;

            return (
                row.guestName.toLowerCase().includes(normalizedSearch) ||
                row.guestEmail.toLowerCase().includes(normalizedSearch) ||
                row._id.toLowerCase().includes(normalizedSearch)
            );
        });

    return rows;
}

/**
 * A single reservation for the admin booking detail view (WO-047) -- unlike
 * `getOwnReservation`, not ownership-scoped: any admin can view any reservation. `null`
 * for an unknown id (same normalize-then-get pattern as the guest-side query).
 */
export async function adminGetReservation(ctx: QueryCtx, args: { reservationId: string }) {
    await requireAdmin(ctx);

    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;
    if (!reservation) return null;

    const [cabin, guest] = await Promise.all([
        ctx.db.get(reservation.cabinId),
        resolveGuestSummary(ctx, reservation.guestId),
    ]);

    return {
        _id: reservation._id,
        cabinName: cabin?.name ?? 'Unknown cabin',
        guestName: guest.name,
        guestEmail: guest.email,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        paymentRequired: reservation.paymentRequired,
        pricing: reservation.pricing,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
    };
}

/**
 * Admin-initiated cancellation (WO-047) -- unlike the guest's `cancelReservation`, not gated
 * by ownership or the 48h window (an admin can cancel on a guest's behalf at any time). Same
 * discipline as the guest path regardless: patches `status` only, never `paymentStatus` --
 * cancelling isn't refunding, and no arbitrary post-payment financial edit belongs here.
 */
export async function adminCancelReservation(ctx: MutationCtx, args: { reservationId: string }) {
    await requireAdmin(ctx);

    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;
    if (!reservation) {
        throw new ConvexError('Unknown reservation.');
    }

    if (reservation.status === RESERVATION_STATUS.CANCELLED) {
        throw new ConvexError('This reservation has already been cancelled.');
    }

    await ctx.db.patch(reservation._id, {
        status: RESERVATION_STATUS.CANCELLED,
        updatedAt: Date.now(),
    });

    return null;
}

/**
 * Admin refund action's atomic pre-check-and-flip (admin refund capability) -- `requireAdmin`
 * needs `ctx.db`, which the Stripe-calling `action` doesn't have, so this runs first as an
 * `internalMutation`. Optimistically patches `paymentStatus` to `REFUNDED` *before* the action
 * ever calls Stripe (not after, the way `applyStripeWebhookTransition` does): Convex mutations
 * are serializable transactions, so two concurrent refund attempts can't both observe `PAID` --
 * the second one's transaction conflicts and, on retry, sees the already-flipped status and
 * throws. This is what actually prevents a double Stripe refund; without it, the paid-status
 * check and the two side-effecting calls (Stripe, then this write) would race. If the
 * subsequent Stripe call fails, the action calls `revertFailedRefund` to undo this. Full-amount
 * refund only (spec's explicit non-goal excludes partial refunds).
 */
export async function beginRefund(ctx: MutationCtx, args: { reservationId: string }) {
    await requireAdmin(ctx);

    const id = ctx.db.normalizeId('reservations', args.reservationId);
    const reservation = id ? await ctx.db.get(id) : null;

    if (!reservation) {
        throw new ConvexError('Unknown reservation.');
    }
    if (reservation.paymentStatus !== PAYMENT_STATUS.PAID || !reservation.stripePaymentIntentId) {
        throw new ConvexError('Only a paid reservation can be refunded.');
    }

    await ctx.db.patch(reservation._id, {
        paymentStatus: PAYMENT_STATUS.REFUNDED,
        updatedAt: Date.now(),
    });

    return {
        reservationId: reservation._id,
        stripePaymentIntentId: reservation.stripePaymentIntentId,
    };
}

/**
 * Compensates a `beginRefund` that optimistically flipped `paymentStatus` to `REFUNDED` when
 * the subsequent Stripe API call then failed -- reverts back to `PAID` so the reservation isn't
 * left claiming a refund that never actually happened at Stripe. No-op if the reservation isn't
 * currently in the `REFUNDED` state this function expects to undo (e.g. a second concurrent
 * attempt already moved past it).
 */
export async function revertFailedRefund(
    ctx: MutationCtx,
    args: { reservationId: Id<'reservations'> },
) {
    const reservation = await ctx.db.get(args.reservationId);

    if (!reservation || reservation.paymentStatus !== PAYMENT_STATUS.REFUNDED) return;

    await ctx.db.patch(args.reservationId, {
        paymentStatus: PAYMENT_STATUS.PAID,
        updatedAt: Date.now(),
    });
}
