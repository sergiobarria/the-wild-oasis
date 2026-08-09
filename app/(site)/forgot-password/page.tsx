import type { Metadata } from 'next';

import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Forgot Password'),
};

export default function ForgotPasswordPage() {
    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-2 p-8'>
            <h1 className='text-2xl font-semibold'>Forgot Password</h1>
            <p className='text-muted-foreground'>Coming soon.</p>
        </div>
    );
}
