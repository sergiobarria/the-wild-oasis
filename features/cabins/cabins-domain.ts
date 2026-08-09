import { parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs';

/**
 * Spec §26's "Search Controls" -- carried over from the home page's availability widget
 * (WO-020). Not reset by "Clear filters" (see `filterParsers` below): these represent the
 * user's search intent, not an optional narrowing.
 */
export const searchControlParsers = {
    checkIn: parseAsString.withDefault(''),
    checkOut: parseAsString.withDefault(''),
    guests: parseAsString.withDefault('1'),
};

/**
 * Spec §26's "Optional simple filters" -- what "Clear filters" resets. `maxPrice` is stored
 * in the URL as whole dollars (readable/shareable); convert with `dollarsToCents` from
 * `lib/money.ts` only at the point a Convex query needs cents. `amenities` holds amenity
 * `_id` strings.
 */
export const filterParsers = {
    search: parseAsString.withDefault(''),
    maxPrice: parseAsInteger,
    amenities: parseAsArrayOf(parseAsString).withDefault([]),
};

type Filters = { search: string; maxPrice: number | null; amenities: string[] };

/** Whether any optional filter is active -- gates showing the "Clear filters" action. */
export function hasActiveFilters(filters: Filters): boolean {
    return filters.search !== '' || filters.maxPrice !== null || filters.amenities.length > 0;
}

/**
 * `searchControlParsers.guests` is an unconstrained string (a hand-edited `?guests=abc` URL
 * parses fine as far as nuqs is concerned) -- falls back to `1` for anything that isn't a
 * positive number before it reaches the Convex query.
 */
export function parseGuests(guests: string): number {
    const parsed = Number(guests);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
