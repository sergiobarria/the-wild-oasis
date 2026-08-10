import { v } from 'convex/values';

import { query } from './_generated/server';
import { reservationStatusValidator } from './lib/reservations';
import * as Users from './model/users';

const adminUserRowValidator = v.object({
    _id: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    createdAt: v.number(),
    reservationCount: v.number(),
});

export const adminListUsers = query({
    args: { search: v.optional(v.string()), role: v.optional(v.string()) },
    returns: v.array(adminUserRowValidator),
    handler: async (ctx, args) => await Users.adminListUsers(ctx, args),
});

const adminUserDetailValidator = v.object({
    _id: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.string(),
    createdAt: v.number(),
    reservations: v.array(
        v.object({
            _id: v.id('reservations'),
            cabinName: v.string(),
            checkIn: v.string(),
            checkOut: v.string(),
            status: reservationStatusValidator,
            total: v.number(),
        }),
    ),
});

export const adminGetUserDetail = query({
    args: { userId: v.string() },
    returns: v.union(adminUserDetailValidator, v.null()),
    handler: async (ctx, args) => await Users.adminGetUserDetail(ctx, args),
});
