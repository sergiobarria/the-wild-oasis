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
    TreePineIcon,
    UsersIcon,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LogoutMenuButton } from '@/features/layout/logout-menu-button';
import { APP_ROUTES } from '@/lib/routes';

const NAV_ITEMS = [
    { label: 'Home', href: APP_ROUTES.ADMIN, icon: HouseIcon },
    { label: 'Bookings', href: APP_ROUTES.ADMIN_BOOKINGS, icon: CalendarDaysIcon },
    { label: 'Cabins', href: APP_ROUTES.ADMIN_CABINS, icon: TreePineIcon },
    { label: 'Messages', href: APP_ROUTES.ADMIN_MESSAGES, icon: MessageSquareIcon },
    { label: 'Users', href: APP_ROUTES.ADMIN_USERS, icon: UsersIcon },
    { label: 'Subscribers', href: APP_ROUTES.ADMIN_SUBSCRIBERS, icon: MailIcon },
    { label: 'Feature Flags', href: APP_ROUTES.ADMIN_FEATURE_FLAGS, icon: FlagIcon },
    { label: 'Settings', href: APP_ROUTES.ADMIN_SETTINGS, icon: SettingsIcon },
] as const;

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <Link
                    href={APP_ROUTES.HOME}
                    className='flex items-center gap-2 px-2 py-1'
                    aria-label='The Wild Oasis home'
                >
                    <Image src='/assets/logo.webp' alt='' width={28} height={20} />
                    <span className='font-heading text-sm font-medium'>The Wild Oasis</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {NAV_ITEMS.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    render={<Link href={item.href} />}
                                    isActive={pathname === item.href}
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
                        <LogoutMenuButton />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
