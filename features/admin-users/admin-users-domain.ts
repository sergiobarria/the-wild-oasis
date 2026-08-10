const VALID_ROLES = ['guest', 'admin'];

/** A hand-edited, stale, or bookmarked `?role=` is never trusted to already be a valid role --
 *  same discipline as `features/admin-bookings/admin-bookings-domain.ts`'s
 *  `buildAdminBookingsQueryArgs`, falling back to "unset" instead of reaching Convex with an
 *  arbitrary string. */
export function parseRoleParam(value: string): string | undefined {
    return VALID_ROLES.includes(value) ? value : undefined;
}

/** Shared by the users list and detail screens so a future change to the initials algorithm
 *  can't apply to only one of them. */
export function initials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}
