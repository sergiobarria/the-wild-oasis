import { components } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import { authComponent } from '../betterAuth/auth';
import { requireAdmin } from './auth';

// Generous bound, same reasoning as elsewhere in this codebase -- never an unbounded read,
// `.take()`/a capped page instead. Free-text `search` can't be pushed into the Better Auth
// component's adapter alongside a role filter, so this narrows in JS on an already-capped
// page, same discipline as cabins.ts's `listFiltered`.
const ADMIN_USERS_CAP = 500;

type BetterAuthUser = {
    _id: string;
    _creationTime: number;
    name: string;
    email: string;
    role?: string | null;
    phone?: string | null;
    createdAt: number;
};

/**
 * The read-only admin user directory (WO-054, spec §77 -- explicitly no role-change UI).
 * Better Auth's component owns the `user` table, so this goes through its public
 * `adapter.findMany` query rather than `ctx.db` (see convex/betterAuth/auth.ts's
 * `authComponent`) -- the same mechanism `getAnyUserById` uses internally.
 */
export async function adminListUsers(ctx: QueryCtx, args: { search?: string; role?: string }) {
    await requireAdmin(ctx);

    const result = await ctx.runQuery(components.betterAuth.adapter.findMany, {
        model: 'user',
        where: args.role
            ? [{ field: 'role', operator: 'eq' as const, value: args.role }]
            : undefined,
        sortBy: { field: 'createdAt', direction: 'desc' as const },
        paginationOpts: { numItems: ADMIN_USERS_CAP, cursor: null },
    });

    const users = result.page as BetterAuthUser[];
    const normalizedSearch = args.search?.trim().toLowerCase();
    const filtered = normalizedSearch
        ? users.filter(
              (user) =>
                  user.name.toLowerCase().includes(normalizedSearch) ||
                  user.email.toLowerCase().includes(normalizedSearch),
          )
        : users;

    // One `by_guestId` read per user (bounded by ADMIN_USERS_CAP above) -- fine at this
    // app's scale, same reasoning as `listOwnReservations`'s per-cabin resolution.
    return await Promise.all(
        filtered.map(async (user) => {
            const reservations = await ctx.db
                .query('reservations')
                .withIndex('by_guestId', (q) => q.eq('guestId', user._id))
                .collect();

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role ?? 'guest',
                createdAt: user.createdAt,
                reservationCount: reservations.length,
            };
        }),
    );
}

export async function adminGetUserDetail(ctx: QueryCtx, args: { userId: string }) {
    await requireAdmin(ctx);

    const user = (await authComponent.getAnyUserById(ctx, args.userId)) as BetterAuthUser | null;
    if (!user) return null;

    const reservations = await ctx.db
        .query('reservations')
        .withIndex('by_guestId', (q) => q.eq('guestId', args.userId))
        .order('desc')
        .collect();

    const uniqueCabinIds = [...new Set(reservations.map((reservation) => reservation.cabinId))];
    const cabinsById = new Map(
        await Promise.all(
            uniqueCabinIds.map(
                async (cabinId: Id<'cabins'>) => [cabinId, await ctx.db.get(cabinId)] as const,
            ),
        ),
    );

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        role: user.role ?? 'guest',
        createdAt: user.createdAt,
        reservations: reservations.map((reservation) => ({
            _id: reservation._id,
            cabinName: cabinsById.get(reservation.cabinId)?.name ?? 'Unknown cabin',
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            status: reservation.status,
            total: reservation.pricing.total,
        })),
    };
}
