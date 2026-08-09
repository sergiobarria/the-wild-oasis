/**
 * `8`, not `6` -- two seeded cabins have `maxGuests: 8`, a lower ceiling would exclude them.
 * Shared by the home page's availability widget and the `/cabins` guests filter.
 */
export const GUEST_OPTIONS = ['1', '2', '4', '6', '8'] as const;
