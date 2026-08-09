import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminSidebar } from '@/features/layout/admin-sidebar';
import { AppShellTopbar } from '@/features/layout/app-shell-topbar';
import { requireAdmin } from '@/lib/require-auth';
import { SIDEBAR_COOKIE_NAME } from '@/lib/sidebar-cookie';

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
    const [, cookieStore] = await Promise.all([requireAdmin(), cookies()]);
    const sidebarOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== 'false';

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={sidebarOpen}>
                <AdminSidebar />
                <SidebarInset>
                    <AppShellTopbar />
                    <div className='flex flex-1 flex-col p-6'>{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
