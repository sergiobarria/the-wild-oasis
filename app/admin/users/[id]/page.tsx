import type { Metadata } from 'next';

import { AdminUserDetailScreen } from '@/features/admin-users/admin-user-detail-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('User Details -- Admin'),
};

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminUserDetailScreen userId={id} />;
}
