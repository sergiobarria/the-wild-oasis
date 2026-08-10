import type { Metadata } from 'next';

import { AdminBookingsScreen } from '@/features/admin-bookings/admin-bookings-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Bookings -- Admin'),
};

export default function AdminBookingsPage() {
    return <AdminBookingsScreen />;
}
