import type { Metadata } from 'next';

import { CabinsScreen } from '@/features/cabins/cabins-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Cabins'),
};

export default function CabinsPage() {
    return <CabinsScreen />;
}
