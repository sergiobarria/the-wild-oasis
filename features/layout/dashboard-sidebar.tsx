'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CalendarDaysIcon, LayoutDashboardIcon, UserIcon } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { LogoutMenuButton } from '@/features/layout/logout-menu-button';
import { APP_ROUTES } from '@/lib/routes';

const NAV_ITEMS = [
    { label: 'Overview', href: APP_ROUTES.DASHBOARD, icon: LayoutDashboardIcon },
    { label: 'Bookings', href: APP_ROUTES.DASHBOARD_BOOKINGS, icon: CalendarDaysIcon },
    { label: 'Profile', href: APP_ROUTES.DASHBOARD_PROFILE, icon: UserIcon },
] as const;

export function DashboardSidebar() {
    const pathname = usePathname();
    const { state, isMobile } = useSidebar();
    const collapsed = state === 'collapsed' && !isMobile;

    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader>
                <Link
                    href={APP_ROUTES.HOME}
                    className='flex items-center justify-center px-0 py-2'
                    aria-label='The Wild Oasis home'
                >
                    {collapsed ? (
                        <Image src='/assets/logo-2.webp' alt='' width={24} height={24} />
                    ) : (
                        <Image src='/assets/logo.webp' alt='' width={180} height={128} />
                    )}
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarMenu className='gap-2'>
                        {NAV_ITEMS.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    render={<Link href={item.href} />}
                                    isActive={pathname === item.href}
                                    tooltip={item.label}
                                >
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <LogoutMenuButton tooltip='Logout' />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
