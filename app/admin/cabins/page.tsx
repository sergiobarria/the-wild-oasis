import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cabins -- Admin -- The Wild Oasis',
};

export default function AdminCabinsPage() {
    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-semibold'>Cabins</h1>
            <p className='text-muted-foreground'>Coming soon.</p>
        </div>
    );
}
