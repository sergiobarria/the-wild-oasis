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

const pricingValidator = v.object({
    nightlySubtotal: v.number(),
    cleaningFee: v.number(),
    taxes: v.number(),
    total: v.number(),
});

const ownReservationValidator = v.object({
    _id: v.id('reservations'),
    cabinName: v.string(),
    checkIn: v.string(),
    checkOut: v.string(),
    guests: v.number(),
    status: reservationStatusValidator,
    paymentStatus: paymentStatusValidator,
    pricing: pricingValidator,
    createdAt: v.number(),
});

export const getOwnReservation = query({
    args: { reservationId: v.string() },
    returns: v.union(ownReservationValidator, v.null()),
    handler: async (ctx, args) => await Reservations.getOwnReservation(ctx, args),
});

const ownReservationSummaryValidator = v.object({
    _id: v.id('reservations'),
    cabinName: v.string(),
    cabinSlug: v.union(v.string(), v.null()),
    coverImageUrl: v.union(v.string(), v.null()),
    checkIn: v.string(),
    checkOut: v.string(),
    guests: v.number(),
    status: reservationStatusValidator,
    paymentStatus: paymentStatusValidator,
    paymentRequired: v.boolean(),
    pricing: pricingValidator,
    createdAt: v.number(),
});

export const listOwnReservations = query({
    args: {},
    returns: v.array(ownReservationSummaryValidator),
    handler: async (ctx) => await Reservations.listOwnReservations(ctx),
});

export const cancelReservation = mutation({
    args: { reservationId: v.string() },
    returns: v.null(),
    handler: async (ctx, args) => await Reservations.cancelReservation(ctx, args),
});

const adminListRowValidator = v.object({
    _id: v.id('reservations'),
    cabinName: v.string(),
    guestName: v.string(),
    guestEmail: v.string(),
    checkIn: v.string(),
    checkOut: v.string(),
    guests: v.number(),
    status: reservationStatusValidator,
    paymentStatus: paymentStatusValidator,
    total: v.number(),
    createdAt: v.number(),
});

export const adminListReservations = query({
    args: {
        search: v.optional(v.string()),
        status: v.optional(reservationStatusValidator),
        paymentStatus: v.optional(paymentStatusValidator),
        cabinId: v.optional(v.id('cabins')),
        checkInFrom: v.optional(v.string()),
        checkInTo: v.optional(v.string()),
    },
    returns: v.array(adminListRowValidator),
    handler: async (ctx, args) => await Reservations.adminListReservations(ctx, args),
});

const adminReservationDetailValidator = v.object({
    _id: v.id('reservations'),
    cabinName: v.string(),
    guestName: v.string(),
    guestEmail: v.string(),
    checkIn: v.string(),
    checkOut: v.string(),
    guests: v.number(),
    status: reservationStatusValidator,
    paymentStatus: paymentStatusValidator,
    paymentRequired: v.boolean(),
    pricing: pricingValidator,
    createdAt: v.number(),
    updatedAt: v.number(),
});

export const adminGetReservation = query({
    args: { reservationId: v.string() },
    returns: v.union(adminReservationDetailValidator, v.null()),
    handler: async (ctx, args) => await Reservations.adminGetReservation(ctx, args),
});

export const adminCancelReservation = mutation({
    args: { reservationId: v.string() },
    returns: v.null(),
    handler: async (ctx, args) => await Reservations.adminCancelReservation(ctx, args),
});
