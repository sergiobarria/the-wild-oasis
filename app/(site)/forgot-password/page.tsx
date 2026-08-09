import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Forgot Password -- The Wild Oasis',
};

export default function ForgotPasswordPage() {
    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-2 p-8'>
            <h1 className='text-2xl font-semibold'>Forgot Password</h1>
            <p className='text-muted-foreground'>Coming soon.</p>
        </div>
    );
}
