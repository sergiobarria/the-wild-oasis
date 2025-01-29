import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		CONVEX_DEPLOYMENT: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
	},
});
