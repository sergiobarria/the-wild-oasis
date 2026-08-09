import { cache } from 'react';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { CabinDetailScreen } from '@/features/cabins/cabin-detail-screen';
import { pageTitle } from '@/lib/site-config';

// `generateMetadata` and the page component each need this cabin -- Next's automatic fetch
// memoization only covers `fetch()` GET requests, and Convex's HTTP client always POSTs, so
// without this both would independently round-trip to Convex for identical data.
const getCabin = cache((slug: string) => fetchQuery(api.cabins.getBySlug, { slug }));

export async function generateMetadata({ params }: PageProps<'/cabins/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const cabin = await getCabin(slug);

    return { title: pageTitle(cabin?.name ?? 'Cabin') };
}

export default async function CabinDetailPage({ params }: PageProps<'/cabins/[slug]'>) {
    const { slug } = await params;
    const cabin = await getCabin(slug);

    if (!cabin) notFound();

    return <CabinDetailScreen cabin={cabin} />;
}
