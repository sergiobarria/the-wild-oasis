import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { messageStatusValidator } from './lib/messages';
import * as Messages from './model/messages';

export const submit = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        subject: v.string(),
        message: v.string(),
        honeypot: v.string(),
    },
    returns: v.object({ success: v.literal(true) }),
    handler: async (ctx, args) => await Messages.submitContactMessage(ctx, args),
});

const adminMessageValidator = v.object({
    _id: v.id('messages'),
    _creationTime: v.number(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    status: messageStatusValidator,
    createdAt: v.number(),
});

export const adminListMessages = query({
    args: { status: v.optional(messageStatusValidator) },
    returns: v.array(adminMessageValidator),
    handler: async (ctx, args) => await Messages.adminListMessages(ctx, args),
});

export const adminMarkRead = mutation({
    args: { messageId: v.id('messages') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Messages.adminMarkRead(ctx, args);
        return null;
    },
});

export const adminMarkUnread = mutation({
    args: { messageId: v.id('messages') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Messages.adminMarkUnread(ctx, args);
        return null;
    },
});

export const adminArchive = mutation({
    args: { messageId: v.id('messages') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Messages.adminArchive(ctx, args);
        return null;
    },
});

export const adminUnarchive = mutation({
    args: { messageId: v.id('messages') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Messages.adminUnarchive(ctx, args);
        return null;
    },
});
