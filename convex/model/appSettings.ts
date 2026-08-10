import { ConvexError } from 'convex/values';

import type { MutationCtx, QueryCtx } from '../_generated/server';
import { CANCELLATION_WINDOW_HOURS } from '../lib/cancellation';
import { requireAdmin } from './auth';

/**
 * The app's single settings row (WO-057) -- lazily defaulted rather than seeded, so a fresh
 * deployment works before any admin ever visits the settings screen. Both the guest-side
 * `cancelReservation` mutation and the admin settings screen read through this.
 */
export async function getAppSettings(ctx: QueryCtx) {
    const settings = await ctx.db.query('appSettings').first();

    return {
        cancellationWindowHours: settings?.cancellationWindowHours ?? CANCELLATION_WINDOW_HOURS,
        updatedAt: settings?.updatedAt ?? null,
        updatedBy: settings?.updatedBy,
    };
}

export async function adminUpdateSettings(
    ctx: MutationCtx,
    args: { cancellationWindowHours: number },
) {
    const admin = await requireAdmin(ctx);

    if (!Number.isInteger(args.cancellationWindowHours) || args.cancellationWindowHours <= 0) {
        throw new ConvexError(
            'Cancellation window must be a whole number of hours greater than 0.',
        );
    }

    const existing = await ctx.db.query('appSettings').first();
    const fields = {
        cancellationWindowHours: args.cancellationWindowHours,
        updatedAt: Date.now(),
        updatedBy: admin._id,
    };

    if (existing) {
        await ctx.db.patch(existing._id, fields);
    } else {
        await ctx.db.insert('appSettings', fields);
    }
}
