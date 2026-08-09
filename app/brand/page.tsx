import type { Metadata } from 'next';

import { BrandScreen } from '@/features/brand/brand-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Brand'),
    description: 'Internal design system reference.',
    robots: { index: false, follow: false },
};

export default function BrandPage() {
    return <BrandScreen />;
}
