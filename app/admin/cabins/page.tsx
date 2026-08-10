import type { Metadata } from 'next';

import { AdminCabinsScreen } from '@/features/admin-cabins/admin-cabins-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Cabins -- Admin'),
};

export default function AdminCabinsPage() {
    return <AdminCabinsScreen />;
}
