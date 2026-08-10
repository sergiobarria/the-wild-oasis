import { ConvexError } from 'convex/values';

import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { requireAdmin } from './auth';

// Generous bound, same reasoning as reservations.ts's BLOCKING_RESERVATIONS_CAP -- a single
// cabin accumulating this many manual blocks is far beyond this app's scale.
const BLOCKS_CAP = 500;

/**
 * A cabin's blocks, for `resolveAvailability`'s `checkAvailabilityDomain` call -- mirrors
 * `loadBlockingReservations`'s shape (`{ checkIn, checkOut }`), the exact shape
 * `AvailabilityBlockLike` already expects (features/availability/availability-domain.ts's
 * doc comment: "Phase 8 wires real rows in without changing this module's signature").
 */
export async function loadActiveBlocks(ctx: QueryCtx, cabinId: Id<'cabins'>) {
    const blocks = await ctx.db
        .query('availabilityBlocks')
        .withIndex('by_cabinId', (q) => q.eq('cabinId', cabinId))
        .take(BLOCKS_CAP);

    return blocks.map((block) => ({ checkIn: block.startDate, checkOut: block.endDate }));
}

export async function adminCreateBlock(
    ctx: MutationCtx,
    args: { cabinId: Id<'cabins'>; startDate: string; endDate: string; reason: string },
) {
    const admin = await requireAdmin(ctx);

    if (args.endDate <= args.startDate) {
        throw new ConvexError('End date must be after the start date.');
    }

    return await ctx.db.insert('availabilityBlocks', {
        cabinId: args.cabinId,
        startDate: args.startDate,
        endDate: args.endDate,
        reason: args.reason,
        createdBy: admin._id,
        createdAt: Date.now(),
    });
}

export async function adminListBlocks(ctx: QueryCtx, args: { cabinId: Id<'cabins'> }) {
    await requireAdmin(ctx);

    return await ctx.db
        .query('availabilityBlocks')
        .withIndex('by_cabinId', (q) => q.eq('cabinId', args.cabinId))
        .order('desc')
        .take(BLOCKS_CAP);
}

export async function adminDeleteBlock(
    ctx: MutationCtx,
    args: { blockId: Id<'availabilityBlocks'> },
) {
    await requireAdmin(ctx);

    const block = await ctx.db.get(args.blockId);
    if (!block) throw new ConvexError('Unknown availability block.');

    await ctx.db.delete(args.blockId);
}
