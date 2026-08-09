import { api } from '@/convex/_generated/api';
import { Footer } from '@/features/layout/footer';
import { Header } from '@/features/layout/header';
import { fetchAuthQuery } from '@/lib/auth-server';
import { isAdmin } from '@/lib/user-roles';

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
    const user = await fetchAuthQuery(api.auth.getCurrentUser, {});

    return (
        <>
            <Header role={user ? (isAdmin(user.role) ? 'admin' : 'guest') : null} />
            <main className='flex flex-1 flex-col'>{children}</main>
            <Footer />
        </>
    );
}
