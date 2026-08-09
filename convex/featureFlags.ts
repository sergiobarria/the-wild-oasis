import { v } from 'convex/values';

import { internalMutation, query } from './_generated/server';
import * as FeatureFlags from './model/featureFlags';

export const isEnabled = query({
    args: { key: v.string() },
    returns: v.boolean(),
    handler: async (ctx, args) => await FeatureFlags.isFeatureEnabled(ctx, args.key),
});

const seedFlagValidator = v.object({
    key: v.string(),
    name: v.string(),
    description: v.string(),
    enabled: v.boolean(),
});

export const seedFeatureFlags = internalMutation({
    args: { flags: v.array(seedFlagValidator) },
    returns: v.array(v.id('featureFlags')),
    handler: async (ctx, args) => await FeatureFlags.seedFeatureFlags(ctx, args),
});
