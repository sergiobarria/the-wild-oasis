import { query } from './_generated/server';

/**
 * The signed-in user's identity, or `null` when unauthenticated.
 * Safe to expose publicly: it only ever returns the caller's own identity.
 */
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.auth.getUserIdentity();
    },
});
