'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    CalendarDaysIcon,
    FlagIcon,
    HouseIcon,
    MailIcon,
    MessageSquareIcon,
    SettingsIcon,
    SparklesIcon,
    TreePineIcon,
    UsersIcon,
} from 'lucide-react';

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
import { SITE_CONFIG } from '@/lib/site-config';

const NAV_ITEMS = [
    { label: 'Home', href: APP_ROUTES.ADMIN, icon: HouseIcon },
    { label: 'Bookings', href: APP_ROUTES.ADMIN_BOOKINGS, icon: CalendarDaysIcon },
    { label: 'Cabins', href: APP_ROUTES.ADMIN_CABINS, icon: TreePineIcon },
    { label: 'Amenities', href: APP_ROUTES.ADMIN_AMENITIES, icon: SparklesIcon },
    { label: 'Messages', href: APP_ROUTES.ADMIN_MESSAGES, icon: MessageSquareIcon },
    { label: 'Users', href: APP_ROUTES.ADMIN_USERS, icon: UsersIcon },
    { label: 'Subscribers', href: APP_ROUTES.ADMIN_SUBSCRIBERS, icon: MailIcon },
    { label: 'Feature Flags', href: APP_ROUTES.ADMIN_FEATURE_FLAGS, icon: FlagIcon },
    { label: 'Settings', href: APP_ROUTES.ADMIN_SETTINGS, icon: SettingsIcon },
] as const;

export function AdminSidebar() {
    const pathname = usePathname();
    const { state, isMobile } = useSidebar();
    const collapsed = state === 'collapsed' && !isMobile;

    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader>
                <Link
                    href={APP_ROUTES.HOME}
                    className='flex items-center justify-center px-0 py-2'
                    aria-label={`${SITE_CONFIG.NAME} home`}
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
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <SidebarMenu className='gap-2'>
                        {NAV_ITEMS.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    render={<Link href={item.href as never} />}
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
