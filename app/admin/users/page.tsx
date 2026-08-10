import type { Metadata } from 'next';

import { AdminUsersScreen } from '@/features/admin-users/admin-users-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Users -- Admin'),
};

export default function AdminUsersPage() {
    return <AdminUsersScreen />;
}
