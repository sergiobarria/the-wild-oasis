import { ConvexError } from 'convex/values';

import { newsletterSchema } from '../../features/newsletter/newsletter-domain';
import type { MutationCtx } from '../_generated/server';
import { rateLimiter } from '../lib/rateLimiter';
import { SUBSCRIBER_STATUS } from '../lib/subscribers';

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
