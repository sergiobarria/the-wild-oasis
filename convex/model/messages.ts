import { ConvexError } from 'convex/values';

import { contactSchema } from '../../features/contact/contact-domain';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { MESSAGE_STATUS, type MessageStatus } from '../lib/messages';
import { rateLimiter } from '../lib/rateLimiter';
import { requireAdmin } from './auth';

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

// Generous bound, same reasoning as elsewhere in this codebase -- never `.collect()`
// unbounded, `.take()` instead.
const ADMIN_MESSAGES_CAP = 500;

/** All messages, or narrowed to one status (WO-052) -- the admin inbox's status filter tabs. */
export async function adminListMessages(ctx: QueryCtx, args: { status?: MessageStatus }) {
    await requireAdmin(ctx);

    return args.status
        ? await ctx.db
              .query('messages')
              .withIndex('by_status', (q) => q.eq('status', args.status as MessageStatus))
              .order('desc')
              .take(ADMIN_MESSAGES_CAP)
        : await ctx.db.query('messages').order('desc').take(ADMIN_MESSAGES_CAP);
}

async function setMessageStatus(
    ctx: MutationCtx,
    messageId: Id<'messages'>,
    status: MessageStatus,
) {
    await requireAdmin(ctx);

    const message = await ctx.db.get(messageId);
    if (!message) throw new ConvexError('Unknown message.');

    await ctx.db.patch(messageId, { status });
}

// Archive isn't terminal -- unread/read/archived all move independently, so a message can be
// unarchived rather than getting stuck once archived.
export async function adminMarkRead(ctx: MutationCtx, args: { messageId: Id<'messages'> }) {
    await setMessageStatus(ctx, args.messageId, MESSAGE_STATUS.READ);
}

export async function adminMarkUnread(ctx: MutationCtx, args: { messageId: Id<'messages'> }) {
    await setMessageStatus(ctx, args.messageId, MESSAGE_STATUS.UNREAD);
}

/** Remembers whichever non-archived status the message had (`preArchiveStatus`) so
 *  `adminUnarchive` can restore it exactly -- archiving an unread message and later
 *  unarchiving it must not silently turn it into a read one. */
export async function adminArchive(ctx: MutationCtx, args: { messageId: Id<'messages'> }) {
    await requireAdmin(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError('Unknown message.');

    const preArchiveStatus =
        message.status === MESSAGE_STATUS.ARCHIVED
            ? (message.preArchiveStatus ?? MESSAGE_STATUS.READ)
            : message.status;

    await ctx.db.patch(args.messageId, { status: MESSAGE_STATUS.ARCHIVED, preArchiveStatus });
}

export async function adminUnarchive(ctx: MutationCtx, args: { messageId: Id<'messages'> }) {
    await requireAdmin(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError('Unknown message.');

    await ctx.db.patch(args.messageId, { status: message.preArchiveStatus ?? MESSAGE_STATUS.READ });
}
