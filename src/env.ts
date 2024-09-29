import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		DATABASE_AUTH_TOKEN: z.string().optional(),
	},
	client: {
		// NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
	},
	shared: {
		NODE_ENV: z.enum(['development', 'production']),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_AUTH_TOKEN: process.env.OPEN_AI_API_KEY,
		// NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	},
});
