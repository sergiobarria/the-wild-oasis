import rateLimiterTest from '@convex-dev/rate-limiter/test';
import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import authComponentSchema from '../betterAuth/schema';
import { rateLimiter } from '../lib/rateLimiter';
import schema from '../schema';
import {
    adminListSubscribers,
    adminRemoveSubscriber,
    adminUnsubscribe,
    subscribeToNewsletter,
} from './subscribers';

const modules = import.meta.glob('../**/*.ts');
const authComponentModules = import.meta.glob('../betterAuth/**/*.ts');

function setupTest() {
    const t = convexTest(schema, modules);
    rateLimiterTest.register(t);
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

describe('subscribeToNewsletter', () => {
    test('inserts a new active subscriber, lower-cased', async () => {
        const t = setupTest();

        const result = await t.run((ctx) =>
            subscribeToNewsletter(ctx, { email: 'Jamie@Example.com' }),
        );

        expect(result).toEqual({ success: true });
        const stored = await t.run((ctx) => ctx.db.query('subscribers').collect());
        expect(stored).toHaveLength(1);
        expect(stored[0]).toMatchObject({ email: 'jamie@example.com', status: 'active' });
    });

    test('rejects an invalid email', async () => {
        const t = setupTest();

        await expect(
            t.run((ctx) => subscribeToNewsletter(ctx, { email: 'not-an-email' })),
        ).rejects.toThrow();

        const stored = await t.run((ctx) => ctx.db.query('subscribers').collect());
        expect(stored).toHaveLength(0);
    });

    test('re-subscribing an already-active email is a no-op success', async () => {
        const t = setupTest();
        await t.run((ctx) => subscribeToNewsletter(ctx, { email: 'jamie@example.com' }));
        await t.run((ctx) =>
            rateLimiter.reset(ctx, 'newsletterSubscribe', { key: 'jamie@example.com' }),
        );

        const result = await t.run((ctx) =>
            subscribeToNewsletter(ctx, { email: 'jamie@example.com' }),
        );

        expect(result).toEqual({ success: true });
        const stored = await t.run((ctx) => ctx.db.query('subscribers').collect());
        expect(stored).toHaveLength(1);
    });

    test('reactivates a previously unsubscribed email', async () => {
        const t = setupTest();
        await t.run((ctx) =>
            ctx.db.insert('subscribers', {
                email: 'jamie@example.com',
                status: 'unsubscribed',
                subscribedAt: 1700000000000,
            }),
        );

        const result = await t.run((ctx) =>
            subscribeToNewsletter(ctx, { email: 'jamie@example.com' }),
        );

        expect(result).toEqual({ success: true });
        const stored = await t.run((ctx) => ctx.db.query('subscribers').collect());
        expect(stored).toHaveLength(1);
        expect(stored[0]!.status).toBe('active');
    });

    test('rejects a second submission from the same email within the rate-limit window', async () => {
        const t = setupTest();
        await t.run((ctx) => subscribeToNewsletter(ctx, { email: 'jamie@example.com' }));

        await expect(
            t.run((ctx) => subscribeToNewsletter(ctx, { email: 'jamie@example.com' })),
        ).rejects.toThrow('Please wait a moment before trying again.');
    });
});

async function seedSubscriber(
    t: ReturnType<typeof setupTest>,
    overrides: { email?: string; status?: 'active' | 'unsubscribed' } = {},
) {
    return await t.run((ctx) =>
        ctx.db.insert('subscribers', {
            email: overrides.email ?? 'jamie@example.com',
            status: overrides.status ?? 'active',
            subscribedAt: 1700000000000,
        }),
    );
}

describe('adminListSubscribers', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuest(t);

        await expect(
            t.withIdentity(guest).run((ctx) => adminListSubscribers(ctx, {})),
        ).rejects.toThrow();
    });

    test('lists all subscribers with no search', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedSubscriber(t, { email: 'jamie@example.com' });
        await seedSubscriber(t, { email: 'alex@example.com' });

        const result = await t.withIdentity(admin).run((ctx) => adminListSubscribers(ctx, {}));

        expect(result).toHaveLength(2);
    });

    test('filters by an email substring', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedSubscriber(t, { email: 'jamie@example.com' });
        await seedSubscriber(t, { email: 'alex@example.com' });

        const result = await t
            .withIdentity(admin)
            .run((ctx) => adminListSubscribers(ctx, { search: 'jamie' }));

        expect(result).toHaveLength(1);
        expect(result[0]!.email).toBe('jamie@example.com');
    });
});

describe('adminUnsubscribe', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuest(t);
        const subscriberId = await seedSubscriber(t);

        await expect(
            t.withIdentity(guest).run((ctx) => adminUnsubscribe(ctx, { subscriberId })),
        ).rejects.toThrow();
    });

    test('marks the subscriber unsubscribed without deleting it', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const subscriberId = await seedSubscriber(t);

        await t.withIdentity(admin).run((ctx) => adminUnsubscribe(ctx, { subscriberId }));

        const subscriber = await t.run((ctx) => ctx.db.get(subscriberId));
        expect(subscriber).toMatchObject({ status: 'unsubscribed' });
    });

    test('throws for an unknown subscriber', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const subscriberId = await seedSubscriber(t);
        await t.run((ctx) => ctx.db.delete(subscriberId));

        await expect(
            t.withIdentity(admin).run((ctx) => adminUnsubscribe(ctx, { subscriberId })),
        ).rejects.toThrow('Unknown subscriber.');
    });
});

describe('adminRemoveSubscriber', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuest(t);
        const subscriberId = await seedSubscriber(t);

        await expect(
            t.withIdentity(guest).run((ctx) => adminRemoveSubscriber(ctx, { subscriberId })),
        ).rejects.toThrow();
    });

    test('deletes the subscriber', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const subscriberId = await seedSubscriber(t);

        await t.withIdentity(admin).run((ctx) => adminRemoveSubscriber(ctx, { subscriberId }));

        expect(await t.run((ctx) => ctx.db.get(subscriberId))).toBeNull();
    });

    test('throws for an unknown subscriber', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const subscriberId = await seedSubscriber(t);
        await t.run((ctx) => ctx.db.delete(subscriberId));

        await expect(
            t.withIdentity(admin).run((ctx) => adminRemoveSubscriber(ctx, { subscriberId })),
        ).rejects.toThrow('Unknown subscriber.');
    });
});
