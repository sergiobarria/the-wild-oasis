import { v } from 'convex/values';

/** Spec §74's message lifecycle. */
export const MESSAGE_STATUS = {
    UNREAD: 'unread',
    READ: 'read',
    ARCHIVED: 'archived',
} as const;

export type MessageStatus = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export const messageStatusValidator = v.union(
    v.literal(MESSAGE_STATUS.UNREAD),
    v.literal(MESSAGE_STATUS.READ),
    v.literal(MESSAGE_STATUS.ARCHIVED),
);
