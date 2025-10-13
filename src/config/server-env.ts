import { createEnv } from '@t3-oss/env-core'
import * as z from 'zod'

export const env = createEnv({
    server: {
        DATABASE_URL: z.url(),
        DATABASE_AUTH_TOKEN: z.string().min(1),
        NODE_ENV: z.enum(['development', 'production']),
        BETTER_AUTH_SECRET: z.string().min(1),
        BETTER_AUTH_URL: z.string(),
        R2_ACCESS_KEY_ID: z.string().min(1),
        R2_SECRET_ACCESS_KEY: z.string().min(1),
        R2_BUCKET: z.string().min(1),
        R2_ENDPOINT: z.string().min(1),
        R2_URL: z.string().min(1),
        R2_REGION: z.string().min(1),
        // OAuth2 providers, optional, update as needed
        // ...
    },
    runtimeEnv: process.env,
})
