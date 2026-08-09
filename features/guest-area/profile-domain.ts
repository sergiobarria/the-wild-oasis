import { z } from 'zod';

import { firstNameSchema, lastNameSchema } from '@/lib/names';

/**
 * Spec §46: first/last name required, phone optional. Email isn't editable through this
 * form at all -- Better Auth's `updateUser` doesn't accept it (a separate, verification-gated
 * `changeEmail` flow), and the spec explicitly allows shipping email read-only for MVP.
 *
 * `phone` is a plain (always-defined) string, not `.optional()` -- an `Input`'s value is
 * always a string, never `undefined`, so the schema's field type must match the form's
 * actual default-values type exactly for TanStack Form's validator typing to line up. An
 * empty string is what "no phone" looks like here; `profile-api.ts`'s `updateProfile`
 * trims and sends it as-is rather than omitting it, since an omitted field leaves a
 * previously-saved phone number untouched instead of clearing it.
 */
export const profileFormSchema = z.object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    phone: z.string().trim(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
