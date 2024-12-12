import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DATABASE_URI: z.string(),
		PAYLOAD_SECRET: z.string().min(1),
		R2_BUCKET: z.string().min(1),
		R2_ACCESS_KEY_ID: z.string().min(1),
		R2_SECRET_ACCESS_KEY: z.string().min(1),
		R2_REGION: z.string().min(1),
		R2_ENDPOINT: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_APP_BASE_URL: z.string().min(1),
	},
	runtimeEnv: {
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		DATABASE_URI: process.env.DATABASE_URI,
		PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
		R2_BUCKET: process.env.R2_BUCKET,
		R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
		R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
		R2_REGION: process.env.R2_REGION,
		R2_ENDPOINT: process.env.R2_ENDPOINT,
	},
});
