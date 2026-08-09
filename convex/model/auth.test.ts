import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import authComponentSchema from '../betterAuth/schema';
import { requireAdmin, requireUser } from './auth';

const modules = import.meta.glob('../**/*.ts');
const authComponentModules = import.meta.glob('../betterAuth/**/*.ts');

function setupTest() {
    const t = convexTest(undefined, modules);
    t.registerComponent('betterAuth', authComponentSchema, authComponentModules);
    return t;
}

describe('requireUser', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();

        await expect(t.run((ctx) => requireUser(ctx))).rejects.toThrow();
    });

    test('returns the signed-in user', async () => {
        const t = setupTest();
        const identity = await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
            email: 'guest@example.com',
            password: 'password123',
            name: 'Guest User',
        });

        const user = await t.withIdentity(identity).run((ctx) => requireUser(ctx));

        expect(user).toMatchObject({ email: 'guest@example.com', role: 'guest' });
    });
});

describe('requireAdmin', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();

        await expect(t.run((ctx) => requireAdmin(ctx))).rejects.toThrow();
    });

    test('throws for an authenticated non-admin', async () => {
        const t = setupTest();
        const identity = await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
            email: 'guest@example.com',
            password: 'password123',
            name: 'Guest User',
        });

        await expect(t.withIdentity(identity).run((ctx) => requireAdmin(ctx))).rejects.toThrow();
    });

    test('allows an admin', async () => {
        const t = setupTest();
        const identity = await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
            email: 'admin@example.com',
            password: 'password123',
            name: 'Admin User',
            role: 'admin',
        });

        const user = await t.withIdentity(identity).run((ctx) => requireAdmin(ctx));

        expect(user).toMatchObject({ email: 'admin@example.com', role: 'admin' });
    });
});
