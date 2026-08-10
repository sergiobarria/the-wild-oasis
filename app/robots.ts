import type { MetadataRoute } from 'next';

/**
 * This is a fictional demo app (docs/00_SPEC.md) -- it should never accumulate real search
 * traffic. Disallows every crawler entirely, and deliberately has no sibling `sitemap.ts`: a
 * sitemap exists to help crawlers find pages, which is exactly what this disallow rule refuses.
 * `app/layout.tsx`'s `robots` metadata (`noindex, nofollow`) is the second, independent layer --
 * a well-behaved crawler that ignored this file would still be told not to index each page.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            disallow: '/',
        },
    };
}
