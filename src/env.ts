import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		TURSO_DATABASE_URL: z.string({ required_error: 'TURSO_DATABASE_URL is required' }),
		TURSO_DATABASE_TOKEN: z.string({ required_error: 'TURSO_DATABASE_TOKEN is required' })
	},
	client: {},
	runtimeEnv: {
		TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
		TURSO_DATABASE_TOKEN: process.env.TURSO_DATABASE_TOKEN
	}
});
