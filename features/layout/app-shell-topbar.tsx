import Link from 'next/link';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { APP_ROUTES } from '@/lib/routes';

export function AppShellTopbar() {
    return (
        <header className='flex h-14 shrink-0 items-center gap-2 border-b border-border px-4'>
            <SidebarTrigger />
            <Separator orientation='vertical' className='h-4' />
            <Link
                href={APP_ROUTES.HOME}
                className='text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
                Back to site
            </Link>
        </header>
    );
}
