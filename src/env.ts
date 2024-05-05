import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		// ...
	},
	clientPrefix: 'VITE_',
	client: {
		VITE_DATABASE_ID: z.string(),
		VITE_API_ENDPOINT: z.string(),
		VITE_PROJECT_ID: z.string(),
		VITE_COLLECTION_ID_CABINS: z.string()
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true
});
