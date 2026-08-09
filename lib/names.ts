import { z } from 'zod';

/** Shared by sign-up and profile editing -- the two places a guest enters a first/last
 *  name -- so the validation rule and its message can't drift between the two forms. */
export const firstNameSchema = z.string().trim().min(1, 'Enter your first name.');
export const lastNameSchema = z.string().trim().min(1, 'Enter your last name.');

/** Better Auth's `user` table stores a single `name` field (see
 *  `convex/betterAuth/schema.ts`), but both the sign-up form and the profile-editing form
 *  work in terms of separate first/last names -- these two live here as the one place that
 *  combines/splits them, rather than duplicating the logic in each feature. A single-word
 *  name or a multi-word last name splits ambiguously (e.g. "Mary Jane Watson" ->
 *  first="Mary", last="Jane Watson") -- an accepted MVP trade-off, not a bug. */
export function splitName(name: string): { firstName: string; lastName: string } {
    const trimmed = name.trim();
    if (!trimmed) return { firstName: '', lastName: '' };

    const [firstName, ...rest] = trimmed.split(/\s+/);
    return { firstName: firstName!, lastName: rest.join(' ') };
}

/** Inverse of `splitName` -- trims and single-spaces so a round trip through a form
 *  doesn't accumulate stray whitespace in the stored `name`. */
export function joinName(firstName: string, lastName: string): string {
    return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
}
