import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Messages -- Admin -- The Wild Oasis',
};

export default function AdminMessagesPage() {
    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-semibold'>Messages</h1>
            <p className='text-muted-foreground'>Coming soon.</p>
        </div>
    );
}
