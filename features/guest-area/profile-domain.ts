/**
 * Better Auth's `user` table stores a single `name` field (see `convex/betterAuth/schema.ts`)
 * -- spec §46 and the sign-up form both work in terms of separate first/last names, so the
 * split happens here, at the UI layer, rather than changing the stored schema. A single-word
 * name or a multi-word last name splits ambiguously (e.g. "Mary Jane Watson" -> first="Mary",
 * last="Jane Watson") -- an accepted MVP trade-off, not a bug.
 */
export function splitName(name: string): { firstName: string; lastName: string } {
    const trimmed = name.trim();
    if (!trimmed) return { firstName: '', lastName: '' };

    const [firstName, ...rest] = trimmed.split(/\s+/);
    return { firstName: firstName!, lastName: rest.join(' ') };
}

/** Inverse of `splitName` -- trims and single-spaces so a round trip through the profile
 *  form doesn't accumulate stray whitespace in the stored `name`. */
export function joinName(firstName: string, lastName: string): string {
    return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
}
