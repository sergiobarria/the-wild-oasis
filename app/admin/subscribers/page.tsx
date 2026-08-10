import type { Metadata } from 'next';

import { AdminSubscribersScreen } from '@/features/admin-subscribers/admin-subscribers-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Subscribers -- Admin'),
};

export default function AdminSubscribersPage() {
    return <AdminSubscribersScreen />;
}
