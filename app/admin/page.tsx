import type { Metadata } from 'next';

import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Admin'),
};

export default function AdminHomePage() {
    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-semibold'>Home</h1>
            <p className='text-muted-foreground'>Coming soon.</p>
        </div>
    );
}
