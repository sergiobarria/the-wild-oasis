import { GuestAreaNav } from '@/features/layout/guest-area-nav';
import { requireUser } from '@/lib/require-auth';

/**
 * Lives under `(site)` so it inherits the public Header/Footer -- spec §43
 * calls for a "deliberately lightweight" account experience, not a second
 * app shell alongside admin's. Just a left-nav/content grid.
 */
export default async function GuestAreaLayout({ children }: LayoutProps<'/guest-area'>) {
    await requireUser();

    return (
        <div className='mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[200px_1fr] lg:px-8'>
            <GuestAreaNav />
            <div className='min-w-0'>{children}</div>
        </div>
    );
}
