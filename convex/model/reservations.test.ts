import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import authComponentSchema from '../betterAuth/schema';
import { RESERVATION_STATUS } from '../lib/reservations';
import schema from '../schema';
import { checkAvailability, createDemoReservation } from './reservations';

const modules = import.meta.glob('../**/*.ts');
const authComponentModules = import.meta.glob('../betterAuth/**/*.ts');

function setupTest() {
    const t = convexTest(schema, modules);
    t.registerComponent('betterAuth', authComponentSchema, authComponentModules);
    return t;
}

async function seedFlag(t: ReturnType<typeof convexTest>, enabled: boolean) {
    await t.run((ctx) =>
        ctx.db.insert('featureFlags', {
            key: 'stripePaymentsEnabled',
            name: 'Stripe payments',
            description: 'Gates the real payment checkout flow.',
            enabled,
            updatedAt: 1700000000000,
        }),
    );
}

async function seedCabin(
    t: ReturnType<typeof convexTest>,
    overrides: { maxGuests?: number; published?: boolean } = {},
): Promise<Id<'cabins'>> {
    const coverImage = await t.run((ctx) =>
        ctx.storage.store(new Blob(['fake-image'], { type: 'image/jpeg' })),
    );

    return await t.run((ctx) =>
        ctx.db.insert('cabins', {
            name: 'Pine Ridge Cabin',
            slug: 'pine-ridge-cabin',
            shortDescription: 'A quiet cabin in the woods.',
            description: 'A longer description of a quiet cabin in the woods.',
            location: 'Pine Ridge',
            nightlyRate: 25000,
            cleaningFee: 3500,
            maxGuests: overrides.maxGuests ?? 4,
            bedrooms: 2,
            beds: 3,
            bathrooms: 1,
            coverImage,
            galleryImages: [coverImage],
            amenities: [],
            published: overrides.published ?? true,
            featured: false,
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
        }),
    );
}

async function seedReservation(
    t: ReturnType<typeof convexTest>,
    cabinId: Id<'cabins'>,
    overrides: {
        checkIn: string;
        checkOut: string;
        status?: (typeof RESERVATION_STATUS)[keyof typeof RESERVATION_STATUS];
    },
) {
    await t.run((ctx) =>
        ctx.db.insert('reservations', {
            cabinId,
            guestId: 'guest-1',
            checkIn: overrides.checkIn,
            checkOut: overrides.checkOut,
            guests: 2,
            status: overrides.status ?? RESERVATION_STATUS.CONFIRMED,
            paymentStatus: 'not_required',
            paymentRequired: false,
            pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
        }),
    );
}

describe('checkAvailability', () => {
    test('throws for an unknown cabin id', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        await t.run((ctx) => ctx.db.delete(cabinId));

        await expect(
            t.run((ctx) =>
                checkAvailability(ctx, {
                    cabinId,
                    checkIn: '2026-08-15',
                    checkOut: '2026-08-18',
                    guests: 2,
                    now: '2026-08-10',
                }),
            ),
        ).rejects.toThrow();
    });

    test('throws for an unpublished cabin, same as an unknown one', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t, { published: false });

        await expect(
            t.run((ctx) =>
                checkAvailability(ctx, {
                    cabinId,
                    checkIn: '2026-08-15',
                    checkOut: '2026-08-18',
                    guests: 2,
                    now: '2026-08-10',
                }),
            ),
        ).rejects.toThrow(`Unknown cabin id "${cabinId}".`);
    });

    test('is available with no conflicting reservations', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);

        const result = await t.run((ctx) =>
            checkAvailability(ctx, {
                cabinId,
                checkIn: '2026-08-15',
                checkOut: '2026-08-18',
                guests: 2,
                now: '2026-08-10',
            }),
        );

        expect(result).toEqual({ available: true });
    });

    test('rejects a guest count over the cabin capacity', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t, { maxGuests: 2 });

        const result = await t.run((ctx) =>
            checkAvailability(ctx, {
                cabinId,
                checkIn: '2026-08-15',
                checkOut: '2026-08-18',
                guests: 3,
                now: '2026-08-10',
            }),
        );

        expect(result).toEqual({
            available: false,
            violations: [{ code: 'GUESTS_EXCEED_CAPACITY' }],
        });
    });

    test('blocks a range overlapping a confirmed reservation', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        await seedReservation(t, cabinId, { checkIn: '2026-08-16', checkOut: '2026-08-20' });

        const result = await t.run((ctx) =>
            checkAvailability(ctx, {
                cabinId,
                checkIn: '2026-08-15',
                checkOut: '2026-08-18',
                guests: 2,
                now: '2026-08-10',
            }),
        );

        expect(result).toEqual({ available: false, violations: [{ code: 'DATE_UNAVAILABLE' }] });
    });

    test('blocks a range overlapping a pending reservation', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        await seedReservation(t, cabinId, {
            checkIn: '2026-08-16',
            checkOut: '2026-08-20',
            status: RESERVATION_STATUS.PENDING,
        });

        const result = await t.run((ctx) =>
            checkAvailability(ctx, {
                cabinId,
                checkIn: '2026-08-17',
                checkOut: '2026-08-19',
                guests: 2,
                now: '2026-08-10',
            }),
        );

        expect(result.available).toBe(false);
    });

    test('does not block on a cancelled reservation covering the same dates', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        await seedReservation(t, cabinId, {
            checkIn: '2026-08-16',
            checkOut: '2026-08-20',
            status: RESERVATION_STATUS.CANCELLED,
        });

        const result = await t.run((ctx) =>
            checkAvailability(ctx, {
                cabinId,
                checkIn: '2026-08-16',
                checkOut: '2026-08-18',
                guests: 2,
                now: '2026-08-10',
            }),
        );

        expect(result).toEqual({ available: true });
    });

    test('rejects a check-in date in the past', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);

        const result = await t.run((ctx) =>
            checkAvailability(ctx, {
                cabinId,
                checkIn: '2026-08-09',
                checkOut: '2026-08-12',
                guests: 2,
                now: '2026-08-10',
            }),
        );

        expect(result).toEqual({ available: false, violations: [{ code: 'PAST_CHECK_IN' }] });
    });

    test("does not block on a different cabin's reservation for the same dates", async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const otherCabinId = await seedCabin(t);
        await seedReservation(t, otherCabinId, { checkIn: '2026-08-16', checkOut: '2026-08-20' });

        const result = await t.run((ctx) =>
            checkAvailability(ctx, {
                cabinId,
                checkIn: '2026-08-16',
                checkOut: '2026-08-18',
                guests: 2,
                now: '2026-08-10',
            }),
        );

        expect(result).toEqual({ available: true });
    });
});

describe('createDemoReservation', () => {
    async function seedGuest(t: ReturnType<typeof setupTest>) {
        return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
            email: 'guest@example.com',
            password: 'password123',
            name: 'Guest User',
        });
    }

    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);

        await expect(
            t.run((ctx) =>
                createDemoReservation(ctx, {
                    cabinId,
                    checkIn: '2030-01-15',
                    checkOut: '2030-01-18',
                    guests: 2,
                }),
            ),
        ).rejects.toThrow();
    });

    test('throws when Stripe payments are enabled', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        await seedFlag(t, true);
        const identity = await seedGuest(t);

        await expect(
            t.withIdentity(identity).run((ctx) =>
                createDemoReservation(ctx, {
                    cabinId,
                    checkIn: '2030-01-15',
                    checkOut: '2030-01-18',
                    guests: 2,
                }),
            ),
        ).rejects.toThrow('Demo confirmation is unavailable while payments are enabled.');
    });

    test('throws when the dates are no longer available', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        await seedReservation(t, cabinId, { checkIn: '2030-01-15', checkOut: '2030-01-18' });
        const identity = await seedGuest(t);

        await expect(
            t.withIdentity(identity).run((ctx) =>
                createDemoReservation(ctx, {
                    cabinId,
                    checkIn: '2030-01-16',
                    checkOut: '2030-01-17',
                    guests: 2,
                }),
            ),
        ).rejects.toThrow('These dates are no longer available.');
    });

    test('throws when the guest count exceeds capacity', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t, { maxGuests: 2 });
        const identity = await seedGuest(t);

        await expect(
            t.withIdentity(identity).run((ctx) =>
                createDemoReservation(ctx, {
                    cabinId,
                    checkIn: '2030-01-15',
                    checkOut: '2030-01-18',
                    guests: 3,
                }),
            ),
        ).rejects.toThrow('These dates are no longer available.');
    });

    test('creates a confirmed, payment-not-required reservation with a pricing snapshot', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const identity = await seedGuest(t);

        const { reservationId } = await t.withIdentity(identity).run((ctx) =>
            createDemoReservation(ctx, {
                cabinId,
                checkIn: '2030-01-15',
                checkOut: '2030-01-18',
                guests: 2,
            }),
        );

        const reservation = await t.run((ctx) => ctx.db.get(reservationId));

        expect(reservation).toMatchObject({
            cabinId,
            checkIn: '2030-01-15',
            checkOut: '2030-01-18',
            guests: 2,
            status: 'confirmed',
            paymentStatus: 'not_required',
            paymentRequired: false,
            pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
        });
        expect(reservation!.guestId).toBe(identity.subject);
    });
});
