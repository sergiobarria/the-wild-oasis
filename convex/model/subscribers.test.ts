import rateLimiterTest from '@convex-dev/rate-limiter/test';
import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { rateLimiter } from '../lib/rateLimiter';
import schema from '../schema';
import { subscribeToNewsletter } from './subscribers';

const modules = import.meta.glob('../**/*.ts');

function setupTest() {
    const t = convexTest(schema, modules);
    rateLimiterTest.register(t);
    return t;
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
