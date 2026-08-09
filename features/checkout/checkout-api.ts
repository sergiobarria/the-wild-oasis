import { notFound } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { fetchAuthQuery } from '@/lib/auth-server';

/**
 * Server-side lookups the checkout summary page needs, gathered in one place so the page
 * component itself stays a thin composition of these calls. The demo confirmation mutation
 * itself is called client-side (`useMutation`, WO-030) -- Convex's Better Auth client
 * provider already attaches the caller's session token, same as every other authenticated
 * client-side call in this app, so no server-side wrapper is needed for it here.
 *
 * Cabin existence is checked before anything else, and only that check maps to `notFound()`
 * (same as `/cabins/[slug]/page.tsx`) -- an unknown/unpublished `cabinId` is the one expected
 * "not found" case here. `checkAvailability` would throw the same `ConvexError` for that case
 * too, so it's deliberately not called until the cabin is confirmed to exist; any other
 * failure (auth, network, a real bug) is left to propagate to `app/error.tsx` rather than
 * being swallowed into a misleading 404.
 */
export async function loadCheckoutSummaryData(args: {
    cabinId: Id<'cabins'>;
    checkIn: string;
    checkOut: string;
    guests: number;
    now: string;
}) {
    const cabin = await fetchAuthQuery(api.cabins.getById, { cabinId: args.cabinId });
    if (!cabin) notFound();

    const [availability, stripePaymentsEnabled, user] = await Promise.all([
        fetchAuthQuery(api.reservations.checkAvailability, args),
        fetchAuthQuery(api.featureFlags.isEnabled, { key: 'stripePaymentsEnabled' }),
        fetchAuthQuery(api.auth.getCurrentUser, {}),
    ]);

    return { cabin, availability, stripePaymentsEnabled, user };
}
