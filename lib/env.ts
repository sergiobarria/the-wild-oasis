import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const env = createEnv({
    server: {
        CONVEX_DEPLOYMENT: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_CONVEX_URL: z.url(),
        NEXT_PUBLIC_CONVEX_SITE_URL: z.url(),
        NEXT_PUBLIC_SITE_URL: z.url(),
    },
    runtimeEnv: {
        CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
        NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    },
    emptyStringAsUndefined: true,
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
