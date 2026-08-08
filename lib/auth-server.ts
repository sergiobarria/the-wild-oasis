import { convexBetterAuthNextJs } from '@convex-dev/better-auth/nextjs';

import { env } from './env';

/**
 * Server-side auth helpers for RSCs, route handlers, and server actions.
 * `handler` proxies /api/auth/* through to the Convex deployment.
 */
export const {
    handler,
    preloadAuthQuery,
    isAuthenticated,
    getToken,
    fetchAuthQuery,
    fetchAuthMutation,
    fetchAuthAction,
} = convexBetterAuthNextJs({
    convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
    convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL,
});
