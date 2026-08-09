import type { Metadata } from 'next';

import { BrandScreen } from '@/features/brand/brand-screen';

export const metadata: Metadata = {
    title: 'Brand -- The Wild Oasis',
    description: 'Internal design system reference.',
    robots: { index: false, follow: false },
};

export default function BrandPage() {
    return <BrandScreen />;
}
