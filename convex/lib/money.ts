/**
 * Enforces "store integer minor units, never floats" (docs/02_CODING_GUIDELINES.md §7) at
 * every write boundary that accepts a money field -- never trust a caller-supplied number.
 */
export function assertIntegerCents(value: number, fieldName: string): void {
    if (!Number.isInteger(value) || value < 0) {
        throw new Error(
            `${fieldName} must be a non-negative integer number of cents, got ${value}.`,
        );
    }
}
