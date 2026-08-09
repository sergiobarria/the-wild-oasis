import type { Metadata } from 'next';

import { BookingsScreen } from '@/features/guest-area/bookings-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Bookings'),
};

export default function GuestAreaBookingsPage() {
    return <BookingsScreen />;
}
