import { AuthSplitLayout } from '@/features/auth/components/auth-split-layout';
import { redirectIfAuthenticated } from '@/lib/require-auth';

// The `(auth)` group has no index page of its own (only /sign-in, /sign-up
// nested under it), so it never registers as a Next.js typed `LayoutRoute` --
// unlike `(site)` (which owns `/`) or `/guest-area` and `/admin` (which own
// their own page). Type `children` directly instead of via `LayoutProps<T>`.
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    await redirectIfAuthenticated();

    return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
