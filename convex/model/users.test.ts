import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import authComponentSchema from '../betterAuth/schema';
import schema from '../schema';
import { adminGetUserDetail, adminListUsers } from './users';

const modules = import.meta.glob('../**/*.ts');
const authComponentModules = import.meta.glob('../betterAuth/**/*.ts');

function setupTest() {
    const t = convexTest(schema, modules);
    t.registerComponent('betterAuth', authComponentSchema, authComponentModules);
    return t;
}

async function seedAdmin(t: ReturnType<typeof setupTest>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
    });
}

async function seedGuest(t: ReturnType<typeof setupTest>, email = 'guest@example.com') {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email,
        password: 'password123',
        name: 'Guest User',
    });
}

async function seedCabin(t: ReturnType<typeof setupTest>): Promise<Id<'cabins'>> {
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
            galleryImages: [],
            amenities: [],
            published: true,
            featured: false,
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
        }),
    );
}

describe('adminListUsers', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuest(t);

        await expect(t.withIdentity(guest).run((ctx) => adminListUsers(ctx, {}))).rejects.toThrow();
    });

    test('lists every user with a reservation count', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuest(t, 'jamie@example.com');
        const cabinId = await seedCabin(t);
        await t.run((ctx) =>
            ctx.db.insert('reservations', {
                cabinId,
                guestId: guest.subject,
                checkIn: '2030-01-15',
                checkOut: '2030-01-18',
                guests: 2,
                status: 'confirmed',
                paymentStatus: 'not_required',
                paymentRequired: false,
                pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
                createdAt: 1700000000000,
                updatedAt: 1700000000000,
            }),
        );

        const result = await t.withIdentity(admin).run((ctx) => adminListUsers(ctx, {}));

        expect(result).toHaveLength(2);
        const jamie = result.find((user) => user.email === 'jamie@example.com');
        expect(jamie).toMatchObject({ reservationCount: 1, role: 'guest' });
    });

    test('filters by a name/email search substring', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedGuest(t, 'jamie@example.com');
        await seedGuest(t, 'alex@example.com');

        const result = await t
            .withIdentity(admin)
            .run((ctx) => adminListUsers(ctx, { search: 'jamie' }));

        expect(result).toHaveLength(1);
        expect(result[0]!.email).toBe('jamie@example.com');
    });

    test('filters by role', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedGuest(t, 'jamie@example.com');

        const result = await t
            .withIdentity(admin)
            .run((ctx) => adminListUsers(ctx, { role: 'admin' }));

        expect(result).toHaveLength(1);
        expect(result[0]!.role).toBe('admin');
    });
});

describe('adminGetUserDetail', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuest(t);

        await expect(
            t.withIdentity(guest).run((ctx) => adminGetUserDetail(ctx, { userId: guest.subject })),
        ).rejects.toThrow();
    });

    test('returns null for an unknown user id', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);

        const result = await t
            .withIdentity(admin)
            .run((ctx) => adminGetUserDetail(ctx, { userId: 'not-real' }));

        expect(result).toBeNull();
    });

    test("returns the user's profile and reservation history", async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuest(t, 'jamie@example.com');
        const cabinId = await seedCabin(t);
        await t.run((ctx) =>
            ctx.db.insert('reservations', {
                cabinId,
                guestId: guest.subject,
                checkIn: '2030-01-15',
                checkOut: '2030-01-18',
                guests: 2,
                status: 'confirmed',
                paymentStatus: 'not_required',
                paymentRequired: false,
                pricing: { nightlySubtotal: 75000, cleaningFee: 3500, taxes: 0, total: 78500 },
                createdAt: 1700000000000,
                updatedAt: 1700000000000,
            }),
        );

        const result = await t
            .withIdentity(admin)
            .run((ctx) => adminGetUserDetail(ctx, { userId: guest.subject }));

        expect(result).toMatchObject({ email: 'jamie@example.com', role: 'guest' });
        expect(result?.reservations).toHaveLength(1);
        expect(result?.reservations[0]).toMatchObject({
            cabinName: 'Pine Ridge Cabin',
            total: 78500,
        });
    });
});
