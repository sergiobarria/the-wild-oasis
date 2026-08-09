import { Footer } from '@/features/layout/footer';
import { Header } from '@/features/layout/header';
import { isAuthenticated } from '@/lib/auth-server';

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
    const authenticated = await isAuthenticated();

    return (
        <>
            <Header isAuthenticated={authenticated} />
            <main className='flex flex-1 flex-col'>{children}</main>
            <Footer />
        </>
    );
}
