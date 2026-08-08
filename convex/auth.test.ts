import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { api } from './_generated/api';

const modules = import.meta.glob('./**/*.ts');

describe('getCurrentUser', () => {
    test('returns null for an unauthenticated caller', async () => {
        const t = convexTest(undefined, modules);

        expect(await t.query(api.auth.getCurrentUser, {})).toBeNull();
    });

    test('returns the identity of the signed-in caller', async () => {
        const t = convexTest(undefined, modules);
        const asUser = t.withIdentity({ subject: 'user_1', issuer: 'https://example.com' });

        expect(await asUser.query(api.auth.getCurrentUser, {})).toMatchObject({
            subject: 'user_1',
        });
    });

    test('does not leak one caller identity to another', async () => {
        const t = convexTest(undefined, modules);
        const asOther = t.withIdentity({ subject: 'user_2', issuer: 'https://example.com' });

        const identity = await asOther.query(api.auth.getCurrentUser, {});

        expect(identity).toMatchObject({ subject: 'user_2' });
        expect(identity).not.toMatchObject({ subject: 'user_1' });
    });
});
