import { defineApp } from 'convex/server';

import betterAuth from './betterAuth/convex.config';

const app = defineApp({
    // Declare backend env vars here for type-safe, deploy-time-validated access.
    // Set values per deployment with `npx convex env set KEY value` — never commit them.
    // Read them via `import { env } from "./_generated/server"`, not `process.env`.
    //
    // env: {
    //   RESEND_API_KEY: v.string(),
    //   LOG_LEVEL: v.optional(v.union(v.literal("debug"), v.literal("info"))),
    // },
    env: {},
});

app.use(betterAuth);

export default app;
