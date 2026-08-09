import { env } from '@/lib/env';

/**
 * Site-wide identity -- name, description, tagline, canonical URL. Defined
 * once so brand chrome (header/footer/sidebars) and page metadata don't each
 * repeat the same strings, and so SEO metadata (OpenGraph, Twitter cards,
 * JSON-LD) has a single source to read from as those land.
 */
export const SITE_CONFIG = {
    NAME: 'The Wild Oasis',
    DESCRIPTION: 'Cabin booking for The Wild Oasis.',
    TAGLINE: 'Handpicked cabins for slowing down, away from the noise.',
    URL: env.NEXT_PUBLIC_SITE_URL,
} as const;

/** `pageTitle('Sign In')` -> `"Sign In -- The Wild Oasis"`; omit for the bare site name. */
export function pageTitle(segment?: string): string {
    return segment ? `${segment} -- ${SITE_CONFIG.NAME}` : SITE_CONFIG.NAME;
}
