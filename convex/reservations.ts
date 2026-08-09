import { v } from 'convex/values';

import { AVAILABILITY_VIOLATION_CODES } from '../features/availability/availability-domain';
import { mutation, query } from './_generated/server';
import { paymentStatusValidator, reservationStatusValidator } from './lib/reservations';
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

export const createDemoReservation = mutation({
    args: {
        cabinId: v.id('cabins'),
        checkIn: v.string(),
        checkOut: v.string(),
        guests: v.number(),
    },
    returns: v.object({ reservationId: v.id('reservations') }),
    handler: async (ctx, args) => await Reservations.createDemoReservation(ctx, args),
});

const ownReservationValidator = v.object({
    _id: v.id('reservations'),
    cabinName: v.string(),
    checkIn: v.string(),
    checkOut: v.string(),
    guests: v.number(),
    status: reservationStatusValidator,
    paymentStatus: paymentStatusValidator,
    pricing: v.object({
        nightlySubtotal: v.number(),
        cleaningFee: v.number(),
        taxes: v.number(),
        total: v.number(),
    }),
    createdAt: v.number(),
});

export const getOwnReservation = query({
    args: { reservationId: v.string() },
    returns: v.union(ownReservationValidator, v.null()),
    handler: async (ctx, args) => await Reservations.getOwnReservation(ctx, args),
});
