import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { options } from '@/convex/betterAuth/auth';

/**
 * `inferAdditionalFields<typeof options>()` types the client against the same
 * `BetterAuthOptions` the server builds from (see `convex/betterAuth/auth.ts`)
 * -- a type-only import, erased at compile time -- so fields like `role` show
 * up on `authClient`'s returned user/session, not just the base Better Auth
 * user shape.
 */
export const authClient = createAuthClient({
    plugins: [convexClient(), inferAdditionalFields<typeof options>()],
});
