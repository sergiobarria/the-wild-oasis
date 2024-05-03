import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		TURSO_DATABASE_URL: z.string({ required_error: 'TURSO_DATABASE_URL is required' }),
		TURSO_DATABASE_TOKEN: z.string({ required_error: 'TURSO_DATABASE_TOKEN is required' }),
		UPLOADTHING_SECRET: z.string({ required_error: 'UPLOADTHING_SECRET is required' }),
		UPLOADTHING_APP_ID: z.string({ required_error: 'UPLOADTHING_APP_ID is required' })
	},
	client: {},
	runtimeEnv: {
		TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
		TURSO_DATABASE_TOKEN: process.env.TURSO_DATABASE_TOKEN,
		UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
		UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID
	}
});
