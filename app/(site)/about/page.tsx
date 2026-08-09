import type { Metadata } from 'next';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { AboutScreen } from '@/features/about/about-screen';
import { pageTitle } from '@/lib/site-config';

const GALLERY_CABIN_COUNT = 6;

export const metadata: Metadata = {
    title: pageTitle('About'),
    description: 'The story, philosophy, and people behind The Wild Oasis.',
};

export default async function AboutPage() {
    const result = await fetchQuery(api.cabins.listPublished, {
        paginationOpts: { numItems: GALLERY_CABIN_COUNT, cursor: null },
    });
    const galleryImageUrls = result.page
        .map((cabin) => cabin.coverImageUrl)
        .filter((url) => url !== null);

    return <AboutScreen galleryImageUrls={galleryImageUrls} />;
}
