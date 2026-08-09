/**
 * One formatting helper per presentation context (docs/02_CODING_GUIDELINES.md §7) --
 * this is the "nightly rate on a cabin card" context specifically.
 */
export function formatNightlyRate(cents: number): string {
    const dollars = cents / 100;
    return `$${dollars.toLocaleString('en-US', { maximumFractionDigits: 2 })}/night`;
}
