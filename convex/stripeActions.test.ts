import { convexTest } from 'convex-test';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { api, internal } from './_generated/api';
import authComponentSchema from './betterAuth/schema';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');
const authComponentModules = import.meta.glob('./betterAuth/**/*.ts');

const createMock = vi.fn(
    async (params: { line_items: { price_data: { unit_amount: number } }[] }) => ({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/test-session',
        payment_intent: null,
        line_items: params.line_items,
    }),
);

const refundMock = vi.fn(async (params: { payment_intent: string }) => ({
    id: 're_test_123',
    payment_intent: params.payment_intent,
}));

vi.mock('stripe', () => ({
    default: class StripeMock {
        checkout = { sessions: { create: createMock } };
        refunds = { create: refundMock };
        static createFetchHttpClient = () => ({});
    },
}));

function setupTest() {
    const t = convexTest(schema, modules);
    t.registerComponent('betterAuth', authComponentSchema, authComponentModules);
    return t;
}

async function seedGuest(t: ReturnType<typeof setupTest>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'guest@example.com',
        password: 'password123',
        name: 'Guest User',
    });
}

async function seedCabin(t: ReturnType<typeof setupTest>) {
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
            maxGuests: 4,
            bedrooms: 2,
            beds: 3,
            bathrooms: 1,
            coverImage,
            galleryImages: [coverImage],
            amenities: [],
            published: true,
            featured: false,
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
        }),
    );
}

async function seedAdmin(t: ReturnType<typeof setupTest>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
    });
}

async function seedPaidReservation(t: ReturnType<typeof setupTest>) {
    const cabinId = await seedCabin(t);
    return await t.run((ctx) =>
        ctx.db.insert('reservations', {
            cabinId,
            guestId: 'guest-1',
            checkIn: '2030-01-15',
            checkOut: '2030-01-18',
            guests: 2,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentRequired: true,
            pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
            stripeCheckoutSessionId: 'cs_test_paid',
            stripePaymentIntentId: 'pi_test_paid',
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
        }),
    );
}

async function seedFlag(t: ReturnType<typeof setupTest>, enabled: boolean) {
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

describe('createStripeCheckoutSession', () => {
    beforeEach(() => {
        createMock.mockClear();
    });

    test('creates a Stripe Checkout Session with the server-derived total and returns its URL', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        await seedFlag(t, true);
        const identity = await seedGuest(t);

        const result = await t
            .withIdentity(identity)
            .action(api.stripeActions.createStripeCheckoutSession, {
                cabinId,
                checkIn: '2030-01-15',
                checkOut: '2030-01-18',
                guests: 2,
                cabinSlug: 'pine-ridge-cabin',
            });

        expect(result).toEqual({ url: 'https://checkout.stripe.com/test-session' });
        expect(createMock).toHaveBeenCalledTimes(1);
        const call = createMock.mock.calls[0]![0] as {
            line_items: { price_data: { unit_amount: number } }[];
            metadata: { reservationId: string };
        };
        expect(call.line_items[0]!.price_data.unit_amount).toBe(78500);
        expect(call.metadata.reservationId).toBeTruthy();
    });

    test('throws when Stripe payments are disabled, before ever calling Stripe', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        await seedFlag(t, false);
        const identity = await seedGuest(t);

        await expect(
            t.withIdentity(identity).action(api.stripeActions.createStripeCheckoutSession, {
                cabinId,
                checkIn: '2030-01-15',
                checkOut: '2030-01-18',
                guests: 2,
                cabinSlug: 'pine-ridge-cabin',
            }),
        ).rejects.toThrow('Stripe payments are not currently enabled.');
        expect(createMock).not.toHaveBeenCalled();
    });
});

describe('adminRefundReservation', () => {
    beforeEach(() => {
        refundMock.mockClear();
    });

    test('throws for a non-admin caller, before ever calling Stripe', async () => {
        const t = setupTest();
        const reservationId = await seedPaidReservation(t);
        const identity = await seedGuest(t);

        await expect(
            t
                .withIdentity(identity)
                .action(api.stripeActions.adminRefundReservation, { reservationId }),
        ).rejects.toThrow();
        expect(refundMock).not.toHaveBeenCalled();
    });

    test('refunds the payment intent and marks the reservation refunded', async () => {
        const t = setupTest();
        const reservationId = await seedPaidReservation(t);
        const admin = await seedAdmin(t);

        await t
            .withIdentity(admin)
            .action(api.stripeActions.adminRefundReservation, { reservationId });

        expect(refundMock).toHaveBeenCalledWith({ payment_intent: 'pi_test_paid' });
        const reservation = await t.run((ctx) => ctx.db.get(reservationId));
        expect(reservation).toMatchObject({ status: 'confirmed', paymentStatus: 'refunded' });
    });

    test('reverts the optimistic refund flip when the Stripe call fails', async () => {
        const t = setupTest();
        const reservationId = await seedPaidReservation(t);
        const admin = await seedAdmin(t);
        refundMock.mockRejectedValueOnce(new Error('Stripe network error'));

        await expect(
            t
                .withIdentity(admin)
                .action(api.stripeActions.adminRefundReservation, { reservationId }),
        ).rejects.toThrow('Stripe network error');

        const reservation = await t.run((ctx) => ctx.db.get(reservationId));
        expect(reservation).toMatchObject({ status: 'confirmed', paymentStatus: 'paid' });
    });

    test('rejects a second concurrent refund attempt once the first has flipped the status', async () => {
        const t = setupTest();
        const reservationId = await seedPaidReservation(t);
        const admin = await seedAdmin(t);

        await t
            .withIdentity(admin)
            .action(api.stripeActions.adminRefundReservation, { reservationId });

        await expect(
            t
                .withIdentity(admin)
                .action(api.stripeActions.adminRefundReservation, { reservationId }),
        ).rejects.toThrow('Only a paid reservation can be refunded.');
        expect(refundMock).toHaveBeenCalledTimes(1);
    });
});
