import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import * as AppSettings from './model/appSettings';

export const getAppSettings = query({
    args: {},
    returns: v.object({
        cancellationWindowHours: v.number(),
        updatedAt: v.union(v.number(), v.null()),
        updatedBy: v.optional(v.string()),
    }),
    handler: async (ctx) => await AppSettings.getAppSettings(ctx),
});

export const adminUpdateSettings = mutation({
    args: { cancellationWindowHours: v.number() },
    returns: v.null(),
    handler: async (ctx, args) => {
        await AppSettings.adminUpdateSettings(ctx, args);
        return null;
    },
});
