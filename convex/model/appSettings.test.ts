import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import authComponentSchema from '../betterAuth/schema';
import { CANCELLATION_WINDOW_HOURS } from '../lib/cancellation';
import schema from '../schema';
import { adminUpdateSettings, getAppSettings } from './appSettings';

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

describe('getAppSettings', () => {
    test('falls back to the hardcoded default when no row exists yet', async () => {
        const t = setupTest();

        const result = await t.run((ctx) => getAppSettings(ctx));

        expect(result).toEqual({
            cancellationWindowHours: CANCELLATION_WINDOW_HOURS,
            updatedAt: null,
            updatedBy: undefined,
        });
    });

    test('returns the stored row once one exists', async () => {
        const t = setupTest();
        await t.run((ctx) =>
            ctx.db.insert('appSettings', {
                cancellationWindowHours: 72,
                updatedAt: 1700000000000,
                updatedBy: 'admin-1',
            }),
        );

        const result = await t.run((ctx) => getAppSettings(ctx));

        expect(result).toMatchObject({ cancellationWindowHours: 72 });
    });
});

describe('adminUpdateSettings', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuest(t);

        await expect(
            t
                .withIdentity(guest)
                .run((ctx) => adminUpdateSettings(ctx, { cancellationWindowHours: 24 })),
        ).rejects.toThrow();
    });

    test('rejects a non-positive window', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminUpdateSettings(ctx, { cancellationWindowHours: 0 })),
        ).rejects.toThrow();
    });

    test('rejects a fractional window', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminUpdateSettings(ctx, { cancellationWindowHours: 24.5 })),
        ).rejects.toThrow();
    });

    test('creates the row on first update', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);

        await t
            .withIdentity(admin)
            .run((ctx) => adminUpdateSettings(ctx, { cancellationWindowHours: 24 }));

        const result = await t.run((ctx) => getAppSettings(ctx));
        expect(result.cancellationWindowHours).toBe(24);
        expect(result.updatedBy).toBe(admin.subject);
    });

    test('updates the existing row rather than inserting a second one', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await t
            .withIdentity(admin)
            .run((ctx) => adminUpdateSettings(ctx, { cancellationWindowHours: 24 }));

        await t
            .withIdentity(admin)
            .run((ctx) => adminUpdateSettings(ctx, { cancellationWindowHours: 72 }));

        const rows = await t.run((ctx) => ctx.db.query('appSettings').collect());
        expect(rows).toHaveLength(1);
        expect(rows[0]!.cancellationWindowHours).toBe(72);
    });
});
