/** Plain dollar amount, e.g. a booking panel's cleaning fee or total line item. */
export function formatCents(cents: number): string {
    const dollars = cents / 100;
    return `$${dollars.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

/**
 * One formatting helper per presentation context (docs/02_CODING_GUIDELINES.md §7) --
 * this is the "nightly rate on a cabin card" context specifically.
 */
export function formatNightlyRate(cents: number): string {
    return `${formatCents(cents)}/night`;
}

/** Boundary conversion for a user-entered whole-dollar amount (e.g. a max-price filter). */
export function dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
}
