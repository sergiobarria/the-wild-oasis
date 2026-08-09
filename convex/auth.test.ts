import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { api, internal } from './_generated/api';
import authComponentSchema from './betterAuth/schema';

const modules = import.meta.glob('./**/*.ts');
const authComponentModules = import.meta.glob('./betterAuth/**/*.ts');

function setupTest() {
    const t = convexTest(undefined, modules);
    t.registerComponent('betterAuth', authComponentSchema, authComponentModules);
    return t;
}

describe('getCurrentUser', () => {
    test('returns null for an unauthenticated caller', async () => {
        const t = setupTest();

        expect(await t.query(api.auth.getCurrentUser, {})).toBeNull();
    });

    test('returns the full record of the signed-in caller, defaulted to guest', async () => {
        const t = setupTest();
        const identity = await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
            email: 'user1@example.com',
            password: 'password123',
            name: 'User One',
        });

        const user = await t.withIdentity(identity).query(api.auth.getCurrentUser, {});

        expect(user).toMatchObject({ email: 'user1@example.com', role: 'guest' });
    });

    test('does not leak one caller identity to another', async () => {
        const t = setupTest();
        await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
            email: 'user1@example.com',
            password: 'password123',
            name: 'User One',
        });
        const identityTwo = await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
            email: 'user2@example.com',
            password: 'password123',
            name: 'User Two',
        });

        const user = await t.withIdentity(identityTwo).query(api.auth.getCurrentUser, {});

        expect(user).toMatchObject({ email: 'user2@example.com' });
        expect(user).not.toMatchObject({ email: 'user1@example.com' });
    });
});
