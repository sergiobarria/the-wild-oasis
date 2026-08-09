import { z } from 'zod';

/**
 * Spec §46: first/last name required, phone optional. Email isn't editable through this
 * form at all -- Better Auth's `updateUser` doesn't accept it (a separate, verification-gated
 * `changeEmail` flow), and the spec explicitly allows shipping email read-only for MVP.
 *
 * `phone` is a plain (always-defined) string, not `.optional()` -- an `Input`'s value is
 * always a string, never `undefined`, so the schema's field type must match the form's
 * actual default-values type exactly for TanStack Form's validator typing to line up. An
 * empty string is what "no phone" looks like here; `profile-api.ts`'s `updateProfile`
 * converts that to `undefined` at the one point it actually needs to mean "omit this field."
 */
export const profileFormSchema = z.object({
    firstName: z.string().trim().min(1, 'Enter your first name.'),
    lastName: z.string().trim().min(1, 'Enter your last name.'),
    phone: z.string().trim(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

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
