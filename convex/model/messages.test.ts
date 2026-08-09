import rateLimiterTest from '@convex-dev/rate-limiter/test';
import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { rateLimiter } from '../lib/rateLimiter';
import schema from '../schema';
import { submitContactMessage } from './messages';

const modules = import.meta.glob('../**/*.ts');

function setupTest() {
    const t = convexTest(schema, modules);
    rateLimiterTest.register(t);
    return t;
}

function validArgs(overrides: Partial<Parameters<typeof submitContactMessage>[1]> = {}) {
    return {
        name: 'Jamie Alder',
        email: 'jamie@example.com',
        subject: 'Question about a cabin',
        message: 'Is the Hidden Creek cabin pet-friendly?',
        honeypot: '',
        ...overrides,
    };
}

describe('submitContactMessage', () => {
    test('inserts an unread message for a valid submission', async () => {
        const t = setupTest();

        const result = await t.run((ctx) => submitContactMessage(ctx, validArgs()));

        expect(result).toEqual({ success: true });
        const stored = await t.run((ctx) => ctx.db.query('messages').collect());
        expect(stored).toHaveLength(1);
        expect(stored[0]).toMatchObject({
            name: 'Jamie Alder',
            email: 'jamie@example.com',
            subject: 'Question about a cabin',
            status: 'unread',
        });
    });

    test('omits phone entirely rather than storing an empty string', async () => {
        const t = setupTest();

        await t.run((ctx) => submitContactMessage(ctx, validArgs({ phone: '' })));

        const stored = await t.run((ctx) => ctx.db.query('messages').collect());
        expect(stored[0]!.phone).toBeUndefined();
    });

    test('stores a provided phone number', async () => {
        const t = setupTest();

        await t.run((ctx) => submitContactMessage(ctx, validArgs({ phone: '555-0100' })));

        const stored = await t.run((ctx) => ctx.db.query('messages').collect());
        expect(stored[0]!.phone).toBe('555-0100');
    });

    test('silently succeeds without inserting when the honeypot is filled', async () => {
        const t = setupTest();

        const result = await t.run((ctx) =>
            submitContactMessage(ctx, validArgs({ honeypot: 'https://spam.example' })),
        );

        expect(result).toEqual({ success: true });
        const stored = await t.run((ctx) => ctx.db.query('messages').collect());
        expect(stored).toHaveLength(0);
    });

    test('rejects an invalid email even if the client bypassed its own validation', async () => {
        const t = setupTest();

        await expect(
            t.run((ctx) => submitContactMessage(ctx, validArgs({ email: 'not-an-email' }))),
        ).rejects.toThrow();

        const stored = await t.run((ctx) => ctx.db.query('messages').collect());
        expect(stored).toHaveLength(0);
    });

    test('rejects a blank message', async () => {
        const t = setupTest();

        await expect(
            t.run((ctx) => submitContactMessage(ctx, validArgs({ message: '   ' }))),
        ).rejects.toThrow();
    });

    test('rejects a second submission from the same email within the rate-limit window', async () => {
        const t = setupTest();
        await t.run((ctx) => submitContactMessage(ctx, validArgs()));

        await expect(
            t.run((ctx) => submitContactMessage(ctx, validArgs({ subject: 'Second try' }))),
        ).rejects.toThrow('Please wait a moment before sending another message.');

        const stored = await t.run((ctx) => ctx.db.query('messages').collect());
        expect(stored).toHaveLength(1);
    });

    test('rate-limits case-insensitively -- a differently-cased email shares the limit', async () => {
        const t = setupTest();
        await t.run((ctx) => submitContactMessage(ctx, validArgs({ email: 'jamie@example.com' })));

        await expect(
            t.run((ctx) => submitContactMessage(ctx, validArgs({ email: 'Jamie@Example.com' }))),
        ).rejects.toThrow('Please wait a moment before sending another message.');
    });

    test('allows a submission from the same email once its limit is reset', async () => {
        const t = setupTest();
        await t.run((ctx) => submitContactMessage(ctx, validArgs()));
        await t.run((ctx) =>
            rateLimiter.reset(ctx, 'contactMessage', { key: 'jamie@example.com' }),
        );

        const result = await t.run((ctx) => submitContactMessage(ctx, validArgs()));

        expect(result).toEqual({ success: true });
        const stored = await t.run((ctx) => ctx.db.query('messages').collect());
        expect(stored).toHaveLength(2);
    });

    test('does not rate-limit a different email address', async () => {
        const t = setupTest();
        await t.run((ctx) => submitContactMessage(ctx, validArgs()));

        const result = await t.run((ctx) =>
            submitContactMessage(ctx, validArgs({ email: 'other@example.com' })),
        );

        expect(result).toEqual({ success: true });
    });
});
