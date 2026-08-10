import rateLimiterTest from '@convex-dev/rate-limiter/test';
import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import authComponentSchema from '../betterAuth/schema';
import { rateLimiter } from '../lib/rateLimiter';
import schema from '../schema';
import {
    adminArchive,
    adminListMessages,
    adminMarkRead,
    adminMarkUnread,
    adminUnarchive,
    submitContactMessage,
} from './messages';

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

async function seedMessage(t: ReturnType<typeof setupTest>, overrides: { status?: string } = {}) {
    return await t.run((ctx) =>
        ctx.db.insert('messages', {
            name: 'Jamie Alder',
            email: 'jamie@example.com',
            subject: 'Question about a cabin',
            message: 'Is the Hidden Creek cabin pet-friendly?',
            status: (overrides.status ?? 'unread') as 'unread' | 'read' | 'archived',
            createdAt: 1700000000000,
        }),
    );
}

describe('adminListMessages', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuest(t);

        await expect(
            t.withIdentity(guest).run((ctx) => adminListMessages(ctx, {})),
        ).rejects.toThrow();
    });

    test('lists all messages when no status filter is given', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedMessage(t, { status: 'unread' });
        await seedMessage(t, { status: 'read' });

        const result = await t.withIdentity(admin).run((ctx) => adminListMessages(ctx, {}));

        expect(result).toHaveLength(2);
    });

    test('filters by status', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedMessage(t, { status: 'unread' });
        await seedMessage(t, { status: 'archived' });

        const result = await t
            .withIdentity(admin)
            .run((ctx) => adminListMessages(ctx, { status: 'archived' }));

        expect(result).toHaveLength(1);
        expect(result[0]!.status).toBe('archived');
    });
});

describe('adminMarkRead / adminMarkUnread / adminArchive / adminUnarchive', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuest(t);
        const messageId = await seedMessage(t);

        await expect(
            t.withIdentity(guest).run((ctx) => adminMarkRead(ctx, { messageId })),
        ).rejects.toThrow();
    });

    test('throws for an unknown message', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const messageId = await seedMessage(t);
        await t.run((ctx) => ctx.db.delete(messageId));

        await expect(
            t.withIdentity(admin).run((ctx) => adminMarkRead(ctx, { messageId })),
        ).rejects.toThrow('Unknown message.');
    });

    test('moves unread -> read -> archived -> unarchived (back to read)', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const messageId = await seedMessage(t, { status: 'unread' });

        await t.withIdentity(admin).run((ctx) => adminMarkRead(ctx, { messageId }));
        expect(await t.run((ctx) => ctx.db.get(messageId))).toMatchObject({ status: 'read' });

        await t.withIdentity(admin).run((ctx) => adminArchive(ctx, { messageId }));
        expect(await t.run((ctx) => ctx.db.get(messageId))).toMatchObject({ status: 'archived' });

        await t.withIdentity(admin).run((ctx) => adminUnarchive(ctx, { messageId }));
        expect(await t.run((ctx) => ctx.db.get(messageId))).toMatchObject({ status: 'read' });

        await t.withIdentity(admin).run((ctx) => adminMarkUnread(ctx, { messageId }));
        expect(await t.run((ctx) => ctx.db.get(messageId))).toMatchObject({ status: 'unread' });
    });

    test('allows marking an archived message read/unread directly -- archive is not terminal', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const messageId = await seedMessage(t, { status: 'archived' });

        await t.withIdentity(admin).run((ctx) => adminMarkRead(ctx, { messageId }));

        expect(await t.run((ctx) => ctx.db.get(messageId))).toMatchObject({ status: 'read' });
    });

    test('unarchiving a message archived while still unread restores it to unread, not read', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const messageId = await seedMessage(t, { status: 'unread' });

        await t.withIdentity(admin).run((ctx) => adminArchive(ctx, { messageId }));
        await t.withIdentity(admin).run((ctx) => adminUnarchive(ctx, { messageId }));

        expect(await t.run((ctx) => ctx.db.get(messageId))).toMatchObject({ status: 'unread' });
    });

    test('re-archiving after unarchiving still remembers the original pre-archive status', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const messageId = await seedMessage(t, { status: 'unread' });

        await t.withIdentity(admin).run((ctx) => adminArchive(ctx, { messageId }));
        await t.withIdentity(admin).run((ctx) => adminUnarchive(ctx, { messageId }));
        await t.withIdentity(admin).run((ctx) => adminArchive(ctx, { messageId }));
        await t.withIdentity(admin).run((ctx) => adminUnarchive(ctx, { messageId }));

        expect(await t.run((ctx) => ctx.db.get(messageId))).toMatchObject({ status: 'unread' });
    });
});
