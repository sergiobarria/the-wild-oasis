import type { Metadata } from 'next';

import { AdminHomeScreen } from '@/features/admin-dashboard/admin-home-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Admin'),
};

export default function AdminHomePage() {
    return <AdminHomeScreen />;
}
