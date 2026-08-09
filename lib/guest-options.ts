/**
 * `8`, not `6` -- two seeded cabins have `maxGuests: 8`, a lower ceiling would exclude them.
 * Shared by the home page's availability widget and the `/cabins` guests filter.
 */
export const GUEST_OPTIONS = ['1', '2', '4', '6', '8'] as const;

/**
 * Every preset under a specific cabin's capacity, plus the capacity itself -- `maxGuests`
 * is a plain, unconstrained number (convex/schema.ts), so a cabin whose real capacity
 * doesn't land on a preset (e.g. 3 or 5) must still offer its actual maximum as an option,
 * not silently cap out at the nearest preset below it.
 */
export function guestOptionsFor(maxGuests: number): string[] {
    return [...GUEST_OPTIONS.filter((option) => Number(option) < maxGuests), String(maxGuests)];
}
