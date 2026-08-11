import { createClient } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import type { GenericCtx } from '@convex-dev/better-auth/utils';
import { requireActionCtx } from '@convex-dev/better-auth/utils';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';

import { components, internal } from '../_generated/api';
import type { DataModel } from '../_generated/dataModel';
import authConfig from '../auth.config';
import { rateLimiter } from '../lib/rateLimiter';
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
            sendResetPassword: async ({ user, url }) => {
                const actionCtx = requireActionCtx(ctx);

                // Email-keyed, same reasoning as `contactMessage`'s limit -- caps how often this
                // account can be re-emailed even if a caller repeatedly requests a reset for it.
                const { ok } = await rateLimiter.limit(actionCtx, 'passwordResetRequest', {
                    key: user.email.toLowerCase(),
                });
                if (!ok) return;

                await actionCtx.runAction(internal.lib.email.sendResetPasswordEmail, {
                    to: user.email,
                    name: user.name,
                    resetUrl: url,
                });
            },
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
                // Spec §46's profile fields. `input: true` (unlike `role`) since the guest
                // edits this themselves via the profile screen.
                phone: {
                    type: 'string',
                    required: false,
                    input: true,
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
