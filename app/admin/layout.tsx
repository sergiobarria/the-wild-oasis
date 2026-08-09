import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/features/layout/admin-sidebar';
import { AppShellTopbar } from '@/features/layout/app-shell-topbar';

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <AppShellTopbar />
                <div className='flex flex-1 flex-col p-6'>{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
