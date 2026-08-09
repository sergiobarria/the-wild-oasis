/** Enforces an integer 1-5 rating at every write boundary -- never trust a caller-supplied value. */
export function assertValidRating(rating: number): void {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error(`rating must be an integer between 1 and 5, got ${rating}.`);
    }
}
