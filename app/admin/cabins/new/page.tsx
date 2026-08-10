import type { Metadata } from 'next';

import { CabinFormScreen } from '@/features/admin-cabins/cabin-form-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('New Cabin -- Admin'),
};

export default function AdminCabinNewPage() {
    return <CabinFormScreen mode='create' />;
}
