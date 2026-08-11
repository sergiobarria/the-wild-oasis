import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import authComponentSchema from '../betterAuth/schema';
import schema from '../schema';
import {
    adminCreateAmenity,
    adminDeleteAmenity,
    adminListAmenities,
    adminUpdateAmenity,
    listAmenities,
    resolveAmenityCards,
    seedAmenities,
} from './amenities';
import { adminCreateCabin } from './cabins';

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

async function seedGuestIdentity(t: ReturnType<typeof setupTest>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'guest@example.com',
        password: 'password123',
        name: 'Guest User',
    });
}

function amenityInput(overrides: Partial<Parameters<typeof adminCreateAmenity>[1]> = {}) {
    return {
        name: 'Pool Table',
        icon: 'Dices' as const,
        category: 'entertainment' as const,
        ...overrides,
    };
}

describe('listAmenities', () => {
    test('returns an empty list when nothing is seeded', async () => {
        const t = convexTest(schema, modules);
        const result = await t.run((ctx) => listAmenities(ctx));
        expect(result).toEqual([]);
    });

    test('returns every seeded amenity', async () => {
        const t = convexTest(schema, modules);
        await t.run((ctx) => seedAmenities(ctx));

        const result = await t.run((ctx) => listAmenities(ctx));
        expect(result.length).toBeGreaterThan(0);
        expect(result.map((amenity) => amenity.name)).toContain('WiFi');
    });
});

describe('resolveAmenityCards', () => {
    test('returns an empty array for an empty id list', async () => {
        const t = convexTest(schema, modules);
        const result = await t.run((ctx) => resolveAmenityCards(ctx, []));
        expect(result).toEqual([]);
    });

    test('resolves ids to their display shape, dropping any unknown id', async () => {
        const t = convexTest(schema, modules);
        const [wifiId] = await t.run((ctx) => seedAmenities(ctx));
        const deletedId = await t.run((ctx) =>
            ctx.db.insert('amenities', { name: 'Temp', icon: 'Wifi', category: 'comfort' }),
        );
        await t.run((ctx) => ctx.db.delete(deletedId));

        const result = await t.run((ctx) => resolveAmenityCards(ctx, [wifiId!, deletedId]));

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ _id: wifiId, name: 'WiFi', icon: 'Wifi' });
    });
});

describe('seedAmenities', () => {
    test('is idempotent by name -- a second run does not create duplicates', async () => {
        const t = convexTest(schema, modules);

        const first = await t.run((ctx) => seedAmenities(ctx));
        const second = await t.run((ctx) => seedAmenities(ctx));

        expect(second).toEqual(first);
        const rows = await t.run((ctx) => ctx.db.query('amenities').collect());
        expect(rows).toHaveLength(first.length);
    });
});

describe('adminListAmenities', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        await expect(t.run((ctx) => adminListAmenities(ctx))).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuestIdentity(t);
        await expect(t.withIdentity(guest).run((ctx) => adminListAmenities(ctx))).rejects.toThrow();
    });

    test('returns every amenity for an admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await t.run((ctx) => seedAmenities(ctx));

        const result = await t.withIdentity(admin).run((ctx) => adminListAmenities(ctx));
        expect(result.length).toBeGreaterThan(0);
    });
});

describe('adminCreateAmenity', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        await expect(t.run((ctx) => adminCreateAmenity(ctx, amenityInput()))).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuestIdentity(t);
        await expect(
            t.withIdentity(guest).run((ctx) => adminCreateAmenity(ctx, amenityInput())),
        ).rejects.toThrow();
    });

    test('creates an amenity for an admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);

        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        const stored = await t.run((ctx) => ctx.db.get(amenityId));
        expect(stored).toMatchObject(amenityInput());
    });

    test('throws on a duplicate name', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await t.withIdentity(admin).run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        await expect(
            t.withIdentity(admin).run((ctx) => adminCreateAmenity(ctx, amenityInput())),
        ).rejects.toThrow('An amenity named "Pool Table" already exists.');
    });
});

describe('adminUpdateAmenity', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        await expect(
            t.run((ctx) => adminUpdateAmenity(ctx, { amenityId, ...amenityInput() })),
        ).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuestIdentity(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        await expect(
            t
                .withIdentity(guest)
                .run((ctx) => adminUpdateAmenity(ctx, { amenityId, ...amenityInput() })),
        ).rejects.toThrow();
    });

    test('throws for an unknown amenity id', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));
        await t.run((ctx) => ctx.db.delete(amenityId));

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminUpdateAmenity(ctx, { amenityId, ...amenityInput() })),
        ).rejects.toThrow('Unknown amenity.');
    });

    test('updates name/icon/category for an admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        await t.withIdentity(admin).run((ctx) =>
            adminUpdateAmenity(ctx, {
                amenityId,
                name: 'Board Games',
                icon: 'Dices',
                category: 'entertainment',
            }),
        );

        const stored = await t.run((ctx) => ctx.db.get(amenityId));
        expect(stored?.name).toBe('Board Games');
    });

    test('does not re-check uniqueness when the name is unchanged', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        await expect(
            t.withIdentity(admin).run((ctx) =>
                adminUpdateAmenity(ctx, {
                    amenityId,
                    ...amenityInput({ category: 'comfort' }),
                }),
            ),
        ).resolves.not.toThrow();
    });

    test('throws on a duplicate name against a different amenity', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await t.withIdentity(admin).run((ctx) => adminCreateAmenity(ctx, amenityInput()));
        const secondId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput({ name: 'Ping Pong Table' })));

        await expect(
            t.withIdentity(admin).run((ctx) =>
                adminUpdateAmenity(ctx, {
                    amenityId: secondId,
                    ...amenityInput({ name: 'Pool Table' }),
                }),
            ),
        ).rejects.toThrow('An amenity named "Pool Table" already exists.');
    });
});

describe('adminDeleteAmenity', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        await expect(t.run((ctx) => adminDeleteAmenity(ctx, { amenityId }))).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuestIdentity(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        await expect(
            t.withIdentity(guest).run((ctx) => adminDeleteAmenity(ctx, { amenityId })),
        ).rejects.toThrow();
    });

    test('throws for an unknown amenity id', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));
        await t.run((ctx) => ctx.db.delete(amenityId));

        await expect(
            t.withIdentity(admin).run((ctx) => adminDeleteAmenity(ctx, { amenityId })),
        ).rejects.toThrow('Unknown amenity.');
    });

    test('deletes an amenity not referenced by any cabin', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));

        await t.withIdentity(admin).run((ctx) => adminDeleteAmenity(ctx, { amenityId }));

        const stored = await t.run((ctx) => ctx.db.get(amenityId));
        expect(stored).toBeNull();
    });

    test('blocks deletion while a cabin still references the amenity', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const amenityId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateAmenity(ctx, amenityInput()));
        const coverImage = await t.run((ctx) =>
            ctx.storage.store(new Blob(['fake-image'], { type: 'image/jpeg' })),
        );

        await t.withIdentity(admin).run((ctx) =>
            adminCreateCabin(ctx, {
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
                amenityIds: [amenityId],
                published: true,
                featured: false,
                coverImage,
            }),
        );

        await expect(
            t.withIdentity(admin).run((ctx) => adminDeleteAmenity(ctx, { amenityId })),
        ).rejects.toThrow('This amenity is used by 1 cabin. Remove it from that cabin first.');
    });
});
