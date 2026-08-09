import { createClient } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import type { GenericCtx } from '@convex-dev/better-auth/utils';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';

import { components } from '../_generated/api';
import type { DataModel } from '../_generated/dataModel';
import authConfig from '../auth.config';
import schema from './schema';

export const authComponent = createClient<DataModel, typeof schema>(components.betterAuth, {
    local: { schema },
    verbose: false,
});

// Secrets live on the Convex deployment (`npx convex env set ...`), not in
// .env.local — the auth instance runs inside Convex, not in the Next.js server.
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
    return {
        appName: 'The Wild Oasis',
        baseURL: process.env.SITE_URL,
        secret: process.env.BETTER_AUTH_SECRET,
        database: authComponent.adapter(ctx),
        emailAndPassword: {
            enabled: true,
            minPasswordLength: 8,
        },
        user: {
            additionalFields: {
                // `type: ['guest', 'admin']` (a literal-string enum, which Better
                // Auth's field-type syntax supports) would give this a real
                // literal-union validator instead of `string` -- but the pinned
                // `@better-auth/cli@1.4.21` (no 1.6.x release exists; see
                // docs/01_PROJECT_SCAFFOLD.md) generates a broken Convex validator
                // for that syntax (`v.union(v.null(), undefined)`, a type error).
                // `USER_ROLES`/`UserRole` in lib/user-roles.ts is the TypeScript-level
                // stand-in until the CLI catches up.
                role: {
                    type: 'string',
                    required: false,
                    defaultValue: 'guest',
                    input: false,
                },
            },
        },
        plugins: [convex({ authConfig })],
    } satisfies BetterAuthOptions;
};

// Consumed by the `auth` CLI when regenerating ./schema.ts.
export const options = createAuthOptions({} as GenericCtx<DataModel>);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
    return betterAuth(createAuthOptions(ctx));
};
