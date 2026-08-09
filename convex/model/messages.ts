import { ConvexError } from 'convex/values';

import { contactSchema } from '../../features/contact/contact-domain';
import type { MutationCtx } from '../_generated/server';
import { MESSAGE_STATUS } from '../lib/messages';
import { rateLimiter } from '../lib/rateLimiter';

export type SubmitContactMessageArgs = {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    /** Always-empty in a real submission -- a bot that auto-fills every field trips this.
     *  Deliberately not part of `contactSchema`: it's never validated as real user data. */
    honeypot: string;
};

/**
 * Submits a contact message (spec §49). Re-validates server-side against the same
 * `contactSchema` the client form uses (docs/02_CODING_GUIDELINES.md §7's "mirrored pure
 * modules") -- never trusts that the client already checked.
 */
export async function submitContactMessage(ctx: MutationCtx, args: SubmitContactMessageArgs) {
    // Silent no-op for a caught bot -- returning the same shape as a real submission means
    // the bot gets no signal about which field tripped the trap.
    if (args.honeypot) return { success: true as const };

    const parsed = contactSchema.safeParse(args);
    if (!parsed.success) {
        throw new ConvexError(parsed.error.issues[0]?.message ?? 'Invalid submission.');
    }

    // Email-keyed, not IP-keyed -- Convex mutations don't see the caller's IP without extra
    // plumbing. Lower-cased so `Jamie@example.com` and `jamie@example.com` share one limit.
    // A bot can still rotate emails; this is a basic deterrent, not a hardened defense.
    const { ok } = await rateLimiter.limit(ctx, 'contactMessage', {
        key: parsed.data.email.toLowerCase(),
    });

    if (!ok) {
        throw new ConvexError('Please wait a moment before sending another message.');
    }

    await ctx.db.insert('messages', {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || undefined,
        subject: parsed.data.subject,
        message: parsed.data.message,
        status: MESSAGE_STATUS.UNREAD,
        createdAt: Date.now(),
    });

    return { success: true as const };
}
