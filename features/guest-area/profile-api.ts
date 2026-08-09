import { authClient } from '@/lib/auth-client';

import { joinName, type ProfileFormValues } from './profile-domain';

/** Direct Better Auth client call, same shape as `features/auth/auth-api.ts` -- not a
 *  Convex mutation, since `name`/`phone` live on Better Auth's own `user` table. */
export async function updateProfile(values: ProfileFormValues) {
    return authClient.updateUser({
        name: joinName(values.firstName, values.lastName),
        phone: values.phone || undefined,
    });
}
