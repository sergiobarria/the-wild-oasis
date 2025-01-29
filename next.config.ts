import type { NextConfig } from 'next';

// NOTE: Import the env vars to validate during build
import './app/_config/env';

const nextConfig: NextConfig = {
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '',
				port: '',
				pathname: '**/*',
			},
		],
	},
};

export default nextConfig;
