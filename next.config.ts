import type { NextConfig } from 'next';

import './lib/env';

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    typedRoutes: true,
    images: {
        // Cabin cover/gallery images are served as signed URLs from Convex file
        // storage -- every deployment (dev, preview, prod) lives at
        // `<deployment-name>.convex.cloud`.
        remotePatterns: [{ protocol: 'https', hostname: '*.convex.cloud' }],
    },
};

export default nextConfig;
