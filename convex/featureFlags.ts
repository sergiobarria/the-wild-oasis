import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import * as FeatureFlags from './model/featureFlags';

export const isEnabled = query({
    args: { key: v.string() },
    returns: v.boolean(),
    handler: async (ctx, args) => await FeatureFlags.isFeatureEnabled(ctx, args.key),
});

const adminFlagValidator = v.object({
    _id: v.id('featureFlags'),
    key: v.string(),
    name: v.string(),
    description: v.string(),
    enabled: v.boolean(),
    updatedAt: v.number(),
    updatedByName: v.optional(v.string()),
});

export const adminListFlags = query({
    args: {},
    returns: v.array(adminFlagValidator),
    handler: async (ctx) => await FeatureFlags.adminListFlags(ctx),
});

export const adminToggleFlag = mutation({
    args: { flagId: v.id('featureFlags'), enabled: v.boolean() },
    returns: v.null(),
    handler: async (ctx, args) => {
        await FeatureFlags.adminToggleFlag(ctx, args);
        return null;
    },
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
