import type { MutationCtx, QueryCtx } from '../_generated/server';

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
