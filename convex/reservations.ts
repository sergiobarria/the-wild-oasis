import { v } from 'convex/values';

import { AVAILABILITY_VIOLATION_CODES } from '../features/availability/availability-domain';
import { query } from './_generated/server';
import * as Reservations from './model/reservations';

const availabilityViolationValidator = v.object({
    code: v.union(...AVAILABILITY_VIOLATION_CODES.map((code) => v.literal(code))),
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
