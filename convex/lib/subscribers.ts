import { v } from 'convex/values';

export const SUBSCRIBER_STATUS = {
    ACTIVE: 'active',
    UNSUBSCRIBED: 'unsubscribed',
} as const;

export type SubscriberStatus = (typeof SUBSCRIBER_STATUS)[keyof typeof SUBSCRIBER_STATUS];

export const subscriberStatusValidator = v.union(
    v.literal(SUBSCRIBER_STATUS.ACTIVE),
    v.literal(SUBSCRIBER_STATUS.UNSUBSCRIBED),
);
