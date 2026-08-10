import type { Metadata } from 'next';

import { CabinFormScreen } from '@/features/admin-cabins/cabin-form-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Edit Cabin -- Admin'),
};

export default async function AdminCabinEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CabinFormScreen mode='edit' cabinId={id} />;
}
