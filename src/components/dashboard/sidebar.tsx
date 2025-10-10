import { Link, useLocation } from '@tanstack/react-router'

import {
    CalendarIcon,
    FlameKindlingIcon,
    HouseIcon,
    MailIcon,
    MessageSquareIcon,
    SettingsIcon,
    UsersIcon,
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { APP_NAME } from '@/config/constants'
import { cn } from '@/lib/utils'

const SIDEBAR_ITEMS = [
    { title: 'Home', path: '/admin', icon: HouseIcon, badge: false },
    { title: 'Bookings', path: '/admin/bookings', icon: CalendarIcon, badge: true },
    { title: 'Cabins', path: '/admin/cabins', icon: FlameKindlingIcon, badge: false },
    { title: 'Messages', path: '/admin/messages', icon: MessageSquareIcon, badge: false },
    { title: 'Subscribers', path: '/admin/subscribers', icon: MailIcon, badge: false },
    { title: 'Users', path: '/admin/users', icon: UsersIcon, badge: false },
]

export function DashboardSidebar() {
    const { open } = useSidebar()
    const location = useLocation()

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
                <Link to="/admin" className="flex items-center gap-2">
                    <img src="/logo-2.webp" alt="logo" className="h-8 w-auto" width={24} height={24} />
                    {open && <span className="font-bold whitespace-nowrap">{APP_NAME}</span>}
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-3">
                            {SIDEBAR_ITEMS.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                                                    <Link to={item.path} className="flex items-center gap-2">
                                                        <item.icon className="h-5 w-5" />
                                                        {item.title}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                className={cn('font-medium', open && 'hidden')}
                                            >
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {/* TODO: Add badge total */}
                                    {item.badge && <SidebarMenuBadge>24</SidebarMenuBadge>}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton asChild isActive={location.pathname === '/admin/settings'}>
                                        <Link to="/admin/settings" className="flex items-center gap-2">
                                            <SettingsIcon />
                                            Settings
                                        </Link>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" className={cn('font-medium', open && 'hidden')}>
                                    <p>Settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
