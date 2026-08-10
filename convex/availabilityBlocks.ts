import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import * as AvailabilityBlocks from './model/availabilityBlocks';

const availabilityBlockValidator = v.object({
    _id: v.id('availabilityBlocks'),
    _creationTime: v.number(),
    cabinId: v.id('cabins'),
    startDate: v.string(),
    endDate: v.string(),
    reason: v.string(),
    createdBy: v.string(),
    createdAt: v.number(),
});

export const adminCreateBlock = mutation({
    args: {
        cabinId: v.id('cabins'),
        startDate: v.string(),
        endDate: v.string(),
        reason: v.string(),
    },
    returns: v.id('availabilityBlocks'),
    handler: async (ctx, args) => await AvailabilityBlocks.adminCreateBlock(ctx, args),
});

export const adminListBlocks = query({
    args: { cabinId: v.id('cabins') },
    returns: v.array(availabilityBlockValidator),
    handler: async (ctx, args) => await AvailabilityBlocks.adminListBlocks(ctx, args),
});

export const adminDeleteBlock = mutation({
    args: { blockId: v.id('availabilityBlocks') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await AvailabilityBlocks.adminDeleteBlock(ctx, args);
        return null;
    },
});
