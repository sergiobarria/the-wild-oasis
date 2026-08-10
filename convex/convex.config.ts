import rateLimiter from '@convex-dev/rate-limiter/convex.config';
import { defineApp } from 'convex/server';
import { v } from 'convex/values';

import betterAuth from './betterAuth/convex.config';

const app = defineApp({
    // Declare backend env vars here for type-safe, deploy-time-validated access.
    // Set values per deployment with `npx convex env set KEY value` — never commit them.
    // Read them via `import { env } from "./_generated/server"`, not `process.env`.
    env: {
        STRIPE_SECRET_KEY: v.string(),
        STRIPE_WEBHOOK_SECRET: v.string(),
        /** Absolute origin used to build Stripe Checkout's `success_url`/`cancel_url` --
         *  already set on this deployment for Better Auth (see `convex/betterAuth/auth.ts`),
         *  declared here too so this app's own code can read it the typed way. */
        SITE_URL: v.string(),
    },
});

app.use(betterAuth);
app.use(rateLimiter);

export default app;
