import { requireUser } from '@/lib/require-auth';

/**
 * Every checkout route requires a signed-in guest -- the booking panel's client-side gate
 * (WO-028) already sends unauthenticated visitors to sign-in first, but that check is only a
 * UX nicety; this is the authoritative one, same pattern as `guest-area/layout.tsx`.
 *
 * `/checkout` has no index page of its own (only /checkout/summary, /checkout/success,
 * /checkout/cancel nested under it), so it never registers as a Next.js typed `LayoutRoute` --
 * same reasoning as `(auth)/layout.tsx`. Type `children` directly instead of via `LayoutProps<T>`.
 */
export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    await requireUser();

    return <div className='mx-auto w-full max-w-2xl px-6 py-12 lg:px-8'>{children}</div>;
}
