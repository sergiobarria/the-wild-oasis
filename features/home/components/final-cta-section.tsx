import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/lib/routes';

export function FinalCtaSection() {
    return (
        <section className='border-t border-border'>
            <div className='mx-auto max-w-3xl px-6 py-24 text-center lg:px-8'>
                <h2 className='font-heading text-3xl font-medium text-balance sm:text-4xl'>
                    Ready to slow down?
                </h2>
                <p className='mt-4 text-lg text-muted-foreground'>
                    Browse every cabin and find the one that feels like yours.
                </p>
                <Button
                    render={<Link href={APP_ROUTES.CABINS} />}
                    nativeButton={false}
                    size='lg'
                    className='mt-8'
                >
                    Explore All Cabins
                </Button>
            </div>
        </section>
    );
}
