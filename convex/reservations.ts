import { v } from 'convex/values';

import { query } from './_generated/server';
import * as Reservations from './model/reservations';

const availabilityViolationValidator = v.object({
    code: v.union(
        v.literal('INVALID_RANGE'),
        v.literal('PAST_CHECK_IN'),
        v.literal('INVALID_GUEST_COUNT'),
        v.literal('GUESTS_EXCEED_CAPACITY'),
        v.literal('DATE_UNAVAILABLE'),
    ),
});

const availabilityResultValidator = v.union(
    v.object({ available: v.literal(true) }),
    v.object({ available: v.literal(false), violations: v.array(availabilityViolationValidator) }),
);

export const checkAvailability = query({
    args: {
        cabinId: v.id('cabins'),
        checkIn: v.string(),
        checkOut: v.string(),
        guests: v.number(),
        now: v.string(),
    },
    returns: availabilityResultValidator,
    handler: async (ctx, args) => await Reservations.checkAvailability(ctx, args),
});
