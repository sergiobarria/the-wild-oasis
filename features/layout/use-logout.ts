'use client';

import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';
import { APP_ROUTES } from '@/lib/routes';

/** Shared sign-out handler for the sidebar's logout button and the guest-area nav's. */
export function useLogout() {
    const router = useRouter();

    return () => {
        void authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push(APP_ROUTES.HOME);
                    // `push` alone can reuse the cached `(site)` layout render (and
                    // its `isAuthenticated` prop) across navigations under the same
                    // layout -- `refresh()` re-fetches server data for the route so
                    // the header actually drops back to its signed-out state.
                    router.refresh();
                },
            },
        });
    };
}
