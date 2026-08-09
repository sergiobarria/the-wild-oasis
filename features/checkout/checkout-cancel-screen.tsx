import type { Route } from 'next';
import Link from 'next/link';

import { XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/lib/routes';

export function CheckoutCancelScreen({ cabinHref }: { cabinHref: string | null }) {
    return (
        <div className='space-y-8 text-center'>
            <div className='space-y-2'>
                <XCircle className='mx-auto size-12 text-muted-foreground' aria-hidden='true' />
                <h1 className='font-heading text-3xl font-medium'>Checkout cancelled</h1>
                <p className='text-muted-foreground'>
                    No reservation was made and nothing was charged. Your dates are still open if
                    you&apos;d like to try again.
                </p>
            </div>

            <div className='flex flex-col items-center gap-2 sm:flex-row sm:justify-center'>
                {cabinHref && (
                    <Button render={<Link href={cabinHref as Route} />} nativeButton={false}>
                        Back to cabin
                    </Button>
                )}
                <Button
                    render={<Link href={APP_ROUTES.CABINS} />}
                    nativeButton={false}
                    variant={cabinHref ? 'outline' : 'default'}
                >
                    Browse cabins
                </Button>
            </div>
        </div>
    );
}
