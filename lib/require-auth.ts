import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/lib/auth-server';
import { APP_ROUTES } from '@/lib/routes';
import { isAdmin } from '@/lib/user-roles';

/**
 * Shared Next-side route guards -- one shape for "must be signed in" and one
 * for "must be an admin", used by every protected layout (`/guest-area`,
 * `/admin`) instead of each hand-rolling its own check. Keeps the `'admin'`
 * role comparison in one place on this side of the app (the equivalent
 * backend-side check lives in `convex/authorization.ts`'s `requireAdmin` --
 * they can't share code directly, different runtimes, but at least neither
 * duplicates itself within its own side).
 */

async function currentPath() {
    return (await headers()).get('x-pathname');
}

function signInRedirect(path: string | null): never {
    redirect(
        path ? `${APP_ROUTES.SIGN_IN}?redirectTo=${encodeURIComponent(path)}` : APP_ROUTES.SIGN_IN,
    );
}

function roleHome(role: string | null | undefined) {
    return isAdmin(role) ? APP_ROUTES.ADMIN : APP_ROUTES.GUEST_AREA;
}

/** Redirects to sign-in (preserving the current path) if not authenticated. */
export async function requireUser() {
    const user = await fetchAuthQuery(api.auth.getCurrentUser, {});

    if (!user) signInRedirect(await currentPath());

    return user;
}

/** Like `requireUser`, but also requires `role === "admin"`. */
export async function requireAdmin() {
    const user = await requireUser();

    if (!isAdmin(user.role)) redirect(APP_ROUTES.GUEST_AREA);

    return user;
}

/** Bounces an already-signed-in visitor away from sign-in/sign-up to their own area. */
export async function redirectIfAuthenticated() {
    const user = await fetchAuthQuery(api.auth.getCurrentUser, {});

    if (user) redirect(roleHome(user.role));
}
