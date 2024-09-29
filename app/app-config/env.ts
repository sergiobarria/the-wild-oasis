import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		DATABASE_AUTH_TOKEN: z.string(),
		APP_SECRET: z.string(),
	},
	shared: {
		NODE_ENV: z.enum(['development', 'production']),
	},
	clientPrefix: 'VITE_',
	client: {
		// VITE_API_URL: z.string().url(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
