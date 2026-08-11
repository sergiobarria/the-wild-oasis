import type { Metadata } from 'next';

import { AdminAmenitiesScreen } from '@/features/admin-amenities/admin-amenities-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Amenities -- Admin'),
};

export default function AdminAmenitiesPage() {
    return <AdminAmenitiesScreen />;
}
