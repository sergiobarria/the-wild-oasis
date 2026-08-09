import { v } from 'convex/values';

import { mutation } from './_generated/server';
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
