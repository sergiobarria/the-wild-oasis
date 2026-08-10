import { ConvexError } from 'convex/values';

import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { authComponent } from '../betterAuth/auth';
import { requireAdmin } from './auth';

/**
 * The single centralized read path for feature flags (spec §42) -- feature code must never
 * query the `featureFlags` table ad hoc. Fails closed: a missing row (never seeded, or a typo'd
 * key) reads as disabled, which matters most for `stripePaymentsEnabled` gating payment
 * creation.
 */
export async function isFeatureEnabled(ctx: QueryCtx, key: string): Promise<boolean> {
    const flag = await ctx.db
        .query('featureFlags')
        .withIndex('by_key', (q) => q.eq('key', key))
        .unique();

    return flag?.enabled ?? false;
}

type SeedFlagInput = {
    key: string;
    name: string;
    description: string;
    enabled: boolean;
};

/**
 * Insert-only: an already-seeded flag is left untouched, including `enabled`. Unlike
 * `Cabins.seedCabins`'s full upsert, re-running this must never silently reset an admin's
 * runtime toggle (e.g. `stripePaymentsEnabled` flipped on) back to its seed default.
 */
export async function seedFeatureFlags(ctx: MutationCtx, args: { flags: SeedFlagInput[] }) {
    const ids = [];

    for (const input of args.flags) {
        const existing = await ctx.db
            .query('featureFlags')
            .withIndex('by_key', (q) => q.eq('key', input.key))
            .unique();

        if (existing) {
            ids.push(existing._id);
            continue;
        }

        ids.push(
            await ctx.db.insert('featureFlags', {
                key: input.key,
                name: input.name,
                description: input.description,
                enabled: input.enabled,
                updatedAt: Date.now(),
            }),
        );
    }

    return ids;
}

/** All flags, with `updatedBy` resolved to a display name for the admin screen (WO-055) --
 *  `undefined` for a seed-created flag no admin has ever touched. `.collect()` is safe here
 *  unlike elsewhere in this codebase: flags are a small, code-defined, fixed set (seeded once
 *  per deployment), never user-generated content that could grow unbounded. */
export async function adminListFlags(ctx: QueryCtx) {
    await requireAdmin(ctx);

    const flags = await ctx.db.query('featureFlags').collect();

    return await Promise.all(
        flags.map(async (flag) => {
            const updatedByUser = flag.updatedBy
                ? await authComponent.getAnyUserById(ctx, flag.updatedBy)
                : null;

            return {
                _id: flag._id,
                key: flag.key,
                name: flag.name,
                description: flag.description,
                enabled: flag.enabled,
                updatedAt: flag.updatedAt,
                updatedByName: updatedByUser?.name,
            };
        }),
    );
}

/**
 * Toggles a flag -- this mutation *is* WO-056's audit trail: every toggle stamps
 * `updatedAt`/`updatedBy` with the acting admin, no separate logging mechanism needed.
 */
export async function adminToggleFlag(
    ctx: MutationCtx,
    args: { flagId: Id<'featureFlags'>; enabled: boolean },
) {
    const admin = await requireAdmin(ctx);

    const flag = await ctx.db.get(args.flagId);
    if (!flag) throw new ConvexError('Unknown feature flag.');

    await ctx.db.patch(args.flagId, {
        enabled: args.enabled,
        updatedAt: Date.now(),
        updatedBy: admin._id,
    });
}
