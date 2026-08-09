import { v } from 'convex/values';

import { components } from './_generated/api';
import { internalMutation } from './_generated/server';
import { createAuth } from './betterAuth/auth';

/**
 * Test-only: drives a real sign-up through Better Auth and returns identity
 * claims (`subject`, `issuer`, `sessionId`) that `t.withIdentity(...)` can
 * use to impersonate the resulting user in convex-test.
 *
 * `authComponent.safeGetAuthUser` resolves the caller by looking up a real
 * session row via `identity.sessionId`, then the user row via
 * `identity.subject` -- `t.withIdentity({ subject, issuer })` alone (no
 * seeded session) is not enough to exercise that path.
 */
export const seedAuthenticatedUser = internalMutation({
    args: {
        email: v.string(),
        password: v.string(),
        name: v.string(),
        role: v.optional(v.union(v.literal('guest'), v.literal('admin'))),
    },
    handler: async (ctx, args) => {
        const auth = createAuth(ctx);
        const { token, user } = await auth.api.signUpEmail({
            body: { email: args.email, password: args.password, name: args.name },
        });

        if (!token) throw new Error('Expected sign-up to auto sign in and return a session token.');

        if (args.role === 'admin') {
            await ctx.runMutation(components.betterAuth.adapter.updateOne, {
                input: {
                    model: 'user',
                    where: [{ field: '_id', value: user.id }],
                    update: { role: 'admin' },
                },
            });
        }

        const session = await ctx.runQuery(components.betterAuth.adapter.findOne, {
            model: 'session',
            where: [{ field: 'token', value: token }],
        });

        if (!session) throw new Error('Expected a session to exist after sign-up.');

        return {
            subject: user.id,
            issuer: 'https://the-wild-oasis.test',
            sessionId: session._id as string,
        };
    },
});
