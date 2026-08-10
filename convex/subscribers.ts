import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { subscriberStatusValidator } from './lib/subscribers';
import * as Subscribers from './model/subscribers';

export const subscribe = mutation({
    args: { email: v.string() },
    returns: v.object({ success: v.literal(true) }),
    handler: async (ctx, args) => await Subscribers.subscribeToNewsletter(ctx, args),
});

const adminSubscriberValidator = v.object({
    _id: v.id('subscribers'),
    _creationTime: v.number(),
    email: v.string(),
    status: subscriberStatusValidator,
    subscribedAt: v.number(),
});

export const adminListSubscribers = query({
    args: { search: v.optional(v.string()) },
    returns: v.array(adminSubscriberValidator),
    handler: async (ctx, args) => await Subscribers.adminListSubscribers(ctx, args),
});

export const adminUnsubscribe = mutation({
    args: { subscriberId: v.id('subscribers') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Subscribers.adminUnsubscribe(ctx, args);
        return null;
    },
});

export const adminRemoveSubscriber = mutation({
    args: { subscriberId: v.id('subscribers') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Subscribers.adminRemoveSubscriber(ctx, args);
        return null;
    },
});
