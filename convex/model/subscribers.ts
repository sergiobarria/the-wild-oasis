import { ConvexError } from 'convex/values';

import { newsletterSchema } from '../../features/newsletter/newsletter-domain';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { rateLimiter } from '../lib/rateLimiter';
import { SUBSCRIBER_STATUS } from '../lib/subscribers';
import { requireAdmin } from './auth';

/**
 * Subscribes an email to the newsletter (WO-017). Re-validates server-side against the
 * same `newsletterSchema` the client form uses, same discipline as
 * `submitContactMessage`.
 */
export async function subscribeToNewsletter(ctx: MutationCtx, args: { email: string }) {
    const parsed = newsletterSchema.safeParse(args);
    if (!parsed.success) {
        throw new ConvexError(parsed.error.issues[0]?.message ?? 'Invalid submission.');
    }

    const email = parsed.data.email.toLowerCase();

    const { ok } = await rateLimiter.limit(ctx, 'newsletterSubscribe', { key: email });
    if (!ok) {
        throw new ConvexError('Please wait a moment before trying again.');
    }

    const existing = await ctx.db
        .query('subscribers')
        .withIndex('by_email', (q) => q.eq('email', email))
        .unique();

    if (existing) {
        // Already active: no-op success -- resubmitting the same email isn't an error.
        if (existing.status === SUBSCRIBER_STATUS.UNSUBSCRIBED) {
            await ctx.db.patch(existing._id, { status: SUBSCRIBER_STATUS.ACTIVE });
        }

        return { success: true as const };
    }

    await ctx.db.insert('subscribers', {
        email,
        status: SUBSCRIBER_STATUS.ACTIVE,
        subscribedAt: Date.now(),
    });

    return { success: true as const };
}

// Generous bound, same reasoning as elsewhere in this codebase -- never `.collect()`
// unbounded, `.take()` instead.
const ADMIN_SUBSCRIBERS_CAP = 500;

/** All subscribers, optionally narrowed by an email substring (WO-053). Not pushed into an
 *  index -- substring matching can't be, same reasoning as cabins.ts's `listFiltered` -- so
 *  this narrows in JS on an already-capped page. */
export async function adminListSubscribers(ctx: QueryCtx, args: { search?: string }) {
    await requireAdmin(ctx);

    const subscribers = await ctx.db.query('subscribers').order('desc').take(ADMIN_SUBSCRIBERS_CAP);

    const normalizedSearch = args.search?.trim().toLowerCase();
    if (!normalizedSearch) return subscribers;

    return subscribers.filter((subscriber) =>
        subscriber.email.toLowerCase().includes(normalizedSearch),
    );
}

export async function adminUnsubscribe(
    ctx: MutationCtx,
    args: { subscriberId: Id<'subscribers'> },
) {
    await requireAdmin(ctx);

    const subscriber = await ctx.db.get(args.subscriberId);
    if (!subscriber) throw new ConvexError('Unknown subscriber.');

    await ctx.db.patch(args.subscriberId, { status: SUBSCRIBER_STATUS.UNSUBSCRIBED });
}

/** Hard delete -- unlike messages/reservations, spec explicitly allows fully removing a
 *  subscriber row, not just marking it unsubscribed. */
export async function adminRemoveSubscriber(
    ctx: MutationCtx,
    args: { subscriberId: Id<'subscribers'> },
) {
    await requireAdmin(ctx);

    const subscriber = await ctx.db.get(args.subscriberId);
    if (!subscriber) throw new ConvexError('Unknown subscriber.');

    await ctx.db.delete(args.subscriberId);
}
