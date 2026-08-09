import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings -- Admin -- The Wild Oasis',
};

export default function AdminSettingsPage() {
    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-semibold'>Settings</h1>
            <p className='text-muted-foreground'>Coming soon.</p>
        </div>
    );
}
