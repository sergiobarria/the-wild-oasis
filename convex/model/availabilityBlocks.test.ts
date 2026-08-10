import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import authComponentSchema from '../betterAuth/schema';
import schema from '../schema';
import {
    adminCreateBlock,
    adminDeleteBlock,
    adminListBlocks,
    loadActiveBlocks,
} from './availabilityBlocks';

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

async function seedGuest(t: ReturnType<typeof setupTest>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'guest@example.com',
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

describe('adminCreateBlock', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const guest = await seedGuest(t);

        await expect(
            t.withIdentity(guest).run((ctx) =>
                adminCreateBlock(ctx, {
                    cabinId,
                    startDate: '2026-08-15',
                    endDate: '2026-08-18',
                    reason: 'Maintenance',
                }),
            ),
        ).rejects.toThrow();
    });

    test('rejects an endDate on or before startDate', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const admin = await seedAdmin(t);

        await expect(
            t.withIdentity(admin).run((ctx) =>
                adminCreateBlock(ctx, {
                    cabinId,
                    startDate: '2026-08-18',
                    endDate: '2026-08-15',
                    reason: 'Maintenance',
                }),
            ),
        ).rejects.toThrow('End date must be after the start date.');
    });

    test('creates a block stamped with the admin as createdBy', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const admin = await seedAdmin(t);

        const blockId = await t.withIdentity(admin).run((ctx) =>
            adminCreateBlock(ctx, {
                cabinId,
                startDate: '2026-08-15',
                endDate: '2026-08-18',
                reason: 'Maintenance',
            }),
        );

        const block = await t.run((ctx) => ctx.db.get(blockId));
        expect(block).toMatchObject({
            cabinId,
            startDate: '2026-08-15',
            endDate: '2026-08-18',
            reason: 'Maintenance',
            createdBy: admin.subject,
        });
    });
});

describe('adminListBlocks', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const guest = await seedGuest(t);

        await expect(
            t.withIdentity(guest).run((ctx) => adminListBlocks(ctx, { cabinId })),
        ).rejects.toThrow();
    });

    test("lists only the given cabin's blocks", async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const otherCabinId = await seedCabin(t);
        const admin = await seedAdmin(t);
        await t.withIdentity(admin).run((ctx) =>
            adminCreateBlock(ctx, {
                cabinId,
                startDate: '2026-08-15',
                endDate: '2026-08-18',
                reason: 'Maintenance',
            }),
        );
        await t.withIdentity(admin).run((ctx) =>
            adminCreateBlock(ctx, {
                cabinId: otherCabinId,
                startDate: '2026-08-15',
                endDate: '2026-08-18',
                reason: 'Maintenance',
            }),
        );

        const result = await t.withIdentity(admin).run((ctx) => adminListBlocks(ctx, { cabinId }));

        expect(result).toHaveLength(1);
        expect(result[0]!.cabinId).toBe(cabinId);
    });
});

describe('adminDeleteBlock', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const admin = await seedAdmin(t);
        const guest = await seedGuest(t);
        const blockId = await t.withIdentity(admin).run((ctx) =>
            adminCreateBlock(ctx, {
                cabinId,
                startDate: '2026-08-15',
                endDate: '2026-08-18',
                reason: 'Maintenance',
            }),
        );

        await expect(
            t.withIdentity(guest).run((ctx) => adminDeleteBlock(ctx, { blockId })),
        ).rejects.toThrow();
    });

    test('deletes the block', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const admin = await seedAdmin(t);
        const blockId = await t.withIdentity(admin).run((ctx) =>
            adminCreateBlock(ctx, {
                cabinId,
                startDate: '2026-08-15',
                endDate: '2026-08-18',
                reason: 'Maintenance',
            }),
        );

        await t.withIdentity(admin).run((ctx) => adminDeleteBlock(ctx, { blockId }));

        expect(await t.run((ctx) => ctx.db.get(blockId))).toBeNull();
    });

    test('throws for an unknown block id', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const admin = await seedAdmin(t);
        const blockId = await t.withIdentity(admin).run((ctx) =>
            adminCreateBlock(ctx, {
                cabinId,
                startDate: '2026-08-15',
                endDate: '2026-08-18',
                reason: 'Maintenance',
            }),
        );
        await t.withIdentity(admin).run((ctx) => adminDeleteBlock(ctx, { blockId }));

        await expect(
            t.withIdentity(admin).run((ctx) => adminDeleteBlock(ctx, { blockId })),
        ).rejects.toThrow('Unknown availability block.');
    });
});

describe('loadActiveBlocks', () => {
    test('maps startDate/endDate to checkIn/checkOut', async () => {
        const t = setupTest();
        const cabinId = await seedCabin(t);
        const admin = await seedAdmin(t);
        await t.withIdentity(admin).run((ctx) =>
            adminCreateBlock(ctx, {
                cabinId,
                startDate: '2026-08-15',
                endDate: '2026-08-18',
                reason: 'Maintenance',
            }),
        );

        const result = await t.run((ctx) => loadActiveBlocks(ctx, cabinId));

        expect(result).toEqual([{ checkIn: '2026-08-15', checkOut: '2026-08-18' }]);
    });
});
