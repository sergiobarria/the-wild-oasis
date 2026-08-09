import type { Metadata } from 'next';

import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Bookings -- Admin'),
};

export default function AdminBookingsPage() {
    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-semibold'>Bookings</h1>
            <p className='text-muted-foreground'>Coming soon.</p>
        </div>
    );
}
