import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About -- The Wild Oasis',
};

export default function AboutPage() {
    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-2 p-8'>
            <h1 className='text-2xl font-semibold'>About</h1>
            <p className='text-muted-foreground'>Coming soon.</p>
        </div>
    );
}
