import type { Metadata } from 'next';

import { AdminMessagesScreen } from '@/features/admin-messages/admin-messages-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Messages -- Admin'),
};

export default function AdminMessagesPage() {
    return <AdminMessagesScreen />;
}
