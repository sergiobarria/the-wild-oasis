import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import schema from '../schema';
import { isFeatureEnabled, seedFeatureFlags } from './featureFlags';

const modules = import.meta.glob('../**/*.ts');

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
