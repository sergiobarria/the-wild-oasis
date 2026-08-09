import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/lib/routes';

/** Spec §44's exact copy -- shared by Overview and Bookings, both of which show this for a
 *  guest with no reservations at all. */
export function GuestAreaEmptyState() {
    return (
        <div className='space-y-3 rounded-lg border border-dashed border-border py-16 text-center'>
            <p className='text-muted-foreground'>
                No stays yet. Your next escape could be closer than you think.
            </p>
            <Button render={<Link href={APP_ROUTES.CABINS} />} nativeButton={false}>
                Explore Cabins
            </Button>
        </div>
    );
}
