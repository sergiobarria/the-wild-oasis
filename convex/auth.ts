import { query } from './_generated/server';
import { authComponent } from './betterAuth/auth';

/**
 * The signed-in user's full record (including `role`), or `null` when
 * unauthenticated. Safe to expose publicly: it only ever returns the
 * caller's own data.
 */
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx);

        return user ?? null;
    },
});
