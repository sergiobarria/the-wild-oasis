import { authClient } from '@/lib/auth-client';
import { joinName } from '@/lib/names';

import type { ProfileFormValues } from './profile-domain';

/**
 * Direct Better Auth client call, same shape as `features/auth/auth-api.ts` -- not a
 * Convex mutation, since `name`/`phone` live on Better Auth's own `user` table.
 *
 * Always sends `phone` as a trimmed string, including `''` -- the request body is
 * `JSON.stringify`-ed, which drops keys whose value is `undefined`, so `phone: undefined`
 * would silently leave a previously-saved phone number untouched instead of clearing it.
 * `profileFormSchema`'s own `.trim()` only affects Zod's validation result, not the raw
 * form value passed here, so a whitespace-only edit is trimmed explicitly rather than sent
 * as-is.
 */
export async function updateProfile(values: ProfileFormValues) {
    return authClient.updateUser({
        name: joinName(values.firstName, values.lastName),
        phone: values.phone.trim(),
    });
}
