import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { api, internal } from './_generated/api';
import authComponentSchema from './betterAuth/schema';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');
const authComponentModules = import.meta.glob('./betterAuth/**/*.ts');

function setupTestWithAuth() {
    const t = convexTest(schema, modules);
    t.registerComponent('betterAuth', authComponentSchema, authComponentModules);
    return t;
}

async function seedAdmin(t: ReturnType<typeof setupTestWithAuth>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
    });
}

async function seedGuest(t: ReturnType<typeof setupTestWithAuth>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'guest@example.com',
        password: 'password123',
        name: 'Guest User',
    });
}

function amenityArgs(
    overrides: Partial<{ name: string; icon: 'Dices'; category: 'entertainment' }> = {},
) {
    return {
        name: 'Pool Table',
        icon: 'Dices' as const,
        category: 'entertainment' as const,
        ...overrides,
    };
}

describe('list', () => {
    test('returns an empty array before seeding', async () => {
        const t = convexTest(schema, modules);

        expect(await t.query(api.amenities.list, {})).toEqual([]);
    });

    test('returns the full canonical set after seeding', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});

        const amenities = await t.query(api.amenities.list, {});

        expect(amenities.length).toBe(26);
        expect(amenities).toContainEqual(
            expect.objectContaining({ name: 'WiFi', category: 'essentials' }),
        );
    });
});

describe('seedAmenities', () => {
    test('is idempotent -- running it twice does not duplicate rows', async () => {
        const t = convexTest(schema, modules);

        await t.mutation(internal.amenities.seedAmenities, {});
        await t.mutation(internal.amenities.seedAmenities, {});

        const amenities = await t.query(api.amenities.list, {});
        expect(amenities.length).toBe(26);
    });
});

describe('adminListAmenities', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const guest = await seedGuest(t);

        await expect(
            t.withIdentity(guest).query(api.amenities.adminListAmenities, {}),
        ).rejects.toThrow();
    });

    test('returns every amenity for an admin caller', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        await t.mutation(internal.amenities.seedAmenities, {});

        const result = await t.withIdentity(admin).query(api.amenities.adminListAmenities, {});
        expect(result.length).toBe(26);
    });
});

describe('adminCreateAmenity', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const guest = await seedGuest(t);

        await expect(
            t.withIdentity(guest).mutation(api.amenities.adminCreateAmenity, amenityArgs()),
        ).rejects.toThrow();
    });

    test('rejects an icon outside the allowed set', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);

        await expect(
            t.withIdentity(admin).mutation(api.amenities.adminCreateAmenity, {
                ...amenityArgs(),
                icon: 'NotARealIcon',
            } as never),
        ).rejects.toThrow();
    });

    test('creates an amenity for an admin caller', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);

        const amenityId = await t
            .withIdentity(admin)
            .mutation(api.amenities.adminCreateAmenity, amenityArgs());

        const amenity = await t.run((ctx) => ctx.db.get(amenityId));
        expect(amenity).toMatchObject(amenityArgs());
    });
});

describe('adminUpdateAmenity', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        const guest = await seedGuest(t);
        const amenityId = await t
            .withIdentity(admin)
            .mutation(api.amenities.adminCreateAmenity, amenityArgs());

        await expect(
            t
                .withIdentity(guest)
                .mutation(api.amenities.adminUpdateAmenity, { amenityId, ...amenityArgs() }),
        ).rejects.toThrow();
    });

    test('updates the amenity for an admin caller', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .mutation(api.amenities.adminCreateAmenity, amenityArgs());

        await t.withIdentity(admin).mutation(api.amenities.adminUpdateAmenity, {
            amenityId,
            ...amenityArgs({ name: 'Board Games' }),
        });

        const amenity = await t.run((ctx) => ctx.db.get(amenityId));
        expect(amenity?.name).toBe('Board Games');
    });
});

describe('adminDeleteAmenity', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        const guest = await seedGuest(t);
        const amenityId = await t
            .withIdentity(admin)
            .mutation(api.amenities.adminCreateAmenity, amenityArgs());

        await expect(
            t.withIdentity(guest).mutation(api.amenities.adminDeleteAmenity, { amenityId }),
        ).rejects.toThrow();
    });

    test('deletes the amenity for an admin caller', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .mutation(api.amenities.adminCreateAmenity, amenityArgs());

        await t.withIdentity(admin).mutation(api.amenities.adminDeleteAmenity, { amenityId });

        expect(await t.run((ctx) => ctx.db.get(amenityId))).toBeNull();
    });
});
