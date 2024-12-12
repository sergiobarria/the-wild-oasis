import type { NextConfig } from 'next';

import { withPayload } from '@payloadcms/next/withPayload';
import createJiti from 'jiti';
import { fileURLToPath } from 'node:url';

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti('./src/env');

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
				pathname: '*/**',
			},
		],
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default withPayload(nextConfig);
