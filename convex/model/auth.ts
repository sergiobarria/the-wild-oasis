import { ConvexError } from 'convex/values';

import type { MutationCtx, QueryCtx } from '../_generated/server';
import { authComponent } from '../betterAuth/auth';

type AuthCtx = QueryCtx | MutationCtx;

/**
 * `role` is a plain `string` in the generated schema, not a literal union
 * (see the comment in `convex/betterAuth/auth.ts`). Mirrors `isAdmin` in
 * `lib/user-roles.ts` on the Next.js side -- can't share the module directly
 * across the Convex/Next.js runtime boundary, so both sides narrow it here.
 */
function isAdmin(role: string | null | undefined): role is 'admin' {
    return role === 'admin';
}

/**
 * The full signed-in user document, including app-specific fields like
 * `role`. Throws if there is no authenticated caller.
 *
 * Every protected query/mutation must call this (or `requireAdmin`) before
 * touching the database -- per spec §9's authorization chain, the client is
 * never trusted to have already checked this.
 */
export async function requireUser(ctx: AuthCtx) {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) throw new ConvexError('Not authenticated');

    return user;
}

/**
 * Like `requireUser`, but also requires `role === "admin"`. No admin
 * mutation or query ships without calling this.
 */
export async function requireAdmin(ctx: AuthCtx) {
    const user = await requireUser(ctx);

    if (!isAdmin(user.role)) throw new ConvexError('Not authorized');

    return user;
}
