import type { Metadata } from 'next';

import { AdminSettingsScreen } from '@/features/admin-settings/admin-settings-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Settings -- Admin'),
};

export default function AdminSettingsPage() {
    return <AdminSettingsScreen />;
}
