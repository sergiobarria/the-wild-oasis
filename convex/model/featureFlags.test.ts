import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import authComponentSchema from '../betterAuth/schema';
import schema from '../schema';
import {
    adminListFlags,
    adminToggleFlag,
    isFeatureEnabled,
    seedFeatureFlags,
} from './featureFlags';

const modules = import.meta.glob('../**/*.ts');
const authComponentModules = import.meta.glob('../betterAuth/**/*.ts');

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

async function seedFlag(t: ReturnType<typeof setupTestWithAuth>) {
    return await t.run((ctx) =>
        ctx.db.insert('featureFlags', {
            key: 'stripePaymentsEnabled',
            name: 'Stripe payments',
            description: 'Gates the real payment checkout flow.',
            enabled: false,
            updatedAt: 1700000000000,
        }),
    );
}

describe('isFeatureEnabled', () => {
    test('fails closed for a flag that was never seeded', async () => {
        const t = convexTest(schema, modules);

        const enabled = await t.run((ctx) => isFeatureEnabled(ctx, 'stripePaymentsEnabled'));

        expect(enabled).toBe(false);
    });

    test('reads a disabled flag as disabled', async () => {
        const t = convexTest(schema, modules);
        await t.run((ctx) =>
            ctx.db.insert('featureFlags', {
                key: 'stripePaymentsEnabled',
                name: 'Stripe payments',
                description: 'Gates the real payment checkout flow.',
                enabled: false,
                updatedAt: 1700000000000,
            }),
        );

        const enabled = await t.run((ctx) => isFeatureEnabled(ctx, 'stripePaymentsEnabled'));

        expect(enabled).toBe(false);
    });

    test('reads an enabled flag as enabled', async () => {
        const t = convexTest(schema, modules);
        await t.run((ctx) =>
            ctx.db.insert('featureFlags', {
                key: 'stripePaymentsEnabled',
                name: 'Stripe payments',
                description: 'Gates the real payment checkout flow.',
                enabled: true,
                updatedAt: 1700000000000,
            }),
        );

        const enabled = await t.run((ctx) => isFeatureEnabled(ctx, 'stripePaymentsEnabled'));

        expect(enabled).toBe(true);
    });
});

describe('seedFeatureFlags', () => {
    test('inserts a flag that does not exist yet', async () => {
        const t = convexTest(schema, modules);

        await t.run((ctx) =>
            seedFeatureFlags(ctx, {
                flags: [
                    {
                        key: 'stripePaymentsEnabled',
                        name: 'Stripe payments',
                        description: 'Gates the real payment checkout flow.',
                        enabled: false,
                    },
                ],
            }),
        );

        const enabled = await t.run((ctx) => isFeatureEnabled(ctx, 'stripePaymentsEnabled'));
        expect(enabled).toBe(false);
    });

    test('never overwrites an already-seeded flag, even if its enabled value changed', async () => {
        const t = convexTest(schema, modules);
        await t.run((ctx) =>
            seedFeatureFlags(ctx, {
                flags: [
                    {
                        key: 'stripePaymentsEnabled',
                        name: 'Stripe payments',
                        description: 'Gates the real payment checkout flow.',
                        enabled: false,
                    },
                ],
            }),
        );

        // Simulate an admin toggling the flag on at runtime.
        const flag = await t.run((ctx) =>
            ctx.db
                .query('featureFlags')
                .withIndex('by_key', (q) => q.eq('key', 'stripePaymentsEnabled'))
                .unique(),
        );
        await t.run((ctx) => ctx.db.patch(flag!._id, { enabled: true }));

        // Re-running the seed (e.g. on every deploy) must not reset it back to false.
        await t.run((ctx) =>
            seedFeatureFlags(ctx, {
                flags: [
                    {
                        key: 'stripePaymentsEnabled',
                        name: 'Stripe payments',
                        description: 'Gates the real payment checkout flow.',
                        enabled: false,
                    },
                ],
            }),
        );

        const enabled = await t.run((ctx) => isFeatureEnabled(ctx, 'stripePaymentsEnabled'));
        expect(enabled).toBe(true);
    });
});

describe('adminListFlags', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const guest = await seedGuest(t);

        await expect(t.withIdentity(guest).run((ctx) => adminListFlags(ctx))).rejects.toThrow();
    });

    test('resolves updatedBy to a display name', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        const flagId = await seedFlag(t);
        await t.withIdentity(admin).run((ctx) => adminToggleFlag(ctx, { flagId, enabled: true }));

        const result = await t.withIdentity(admin).run((ctx) => adminListFlags(ctx));

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ enabled: true, updatedByName: 'Admin User' });
    });

    test('leaves updatedByName undefined for a never-toggled, seed-only flag', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        await seedFlag(t);

        const result = await t.withIdentity(admin).run((ctx) => adminListFlags(ctx));

        expect(result[0]!.updatedByName).toBeUndefined();
    });
});

describe('adminToggleFlag', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const guest = await seedGuest(t);
        const flagId = await seedFlag(t);

        await expect(
            t.withIdentity(guest).run((ctx) => adminToggleFlag(ctx, { flagId, enabled: true })),
        ).rejects.toThrow();
    });

    test('throws for an unknown flag', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        const flagId = await seedFlag(t);
        await t.run((ctx) => ctx.db.delete(flagId));

        await expect(
            t.withIdentity(admin).run((ctx) => adminToggleFlag(ctx, { flagId, enabled: true })),
        ).rejects.toThrow('Unknown feature flag.');
    });

    // This test is WO-056's audit trail proof: toggling a flag stamps both updatedAt and
    // updatedBy with the acting admin.
    test('sets updatedAt and updatedBy on every toggle', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        const flagId = await seedFlag(t);

        await t.withIdentity(admin).run((ctx) => adminToggleFlag(ctx, { flagId, enabled: true }));

        const flag = await t.run((ctx) => ctx.db.get(flagId));
        expect(flag).toMatchObject({ enabled: true, updatedBy: admin.subject });
        expect(flag!.updatedAt).toBeGreaterThan(1700000000000);
    });
});
