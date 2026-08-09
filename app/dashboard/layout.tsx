import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppShellTopbar } from '@/features/layout/app-shell-topbar';
import { DashboardSidebar } from '@/features/layout/dashboard-sidebar';
import { SIDEBAR_COOKIE_NAME } from '@/lib/sidebar-cookie';

export default async function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
    const cookieStore = await cookies();
    const sidebarOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== 'false';

    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={sidebarOpen}>
                <DashboardSidebar />
                <SidebarInset>
                    <AppShellTopbar />
                    <div className='flex flex-1 flex-col p-6'>{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
