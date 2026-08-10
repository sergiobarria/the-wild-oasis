import { v } from 'convex/values';

import { mutation } from './_generated/server';
import * as Subscribers from './model/subscribers';

export const subscribe = mutation({
    args: { email: v.string() },
    returns: v.object({ success: v.literal(true) }),
    handler: async (ctx, args) => await Subscribers.subscribeToNewsletter(ctx, args),
});
