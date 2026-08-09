'use client';

import { LogOutIcon } from 'lucide-react';

import { SidebarMenuButton } from '@/components/ui/sidebar';

import { useLogout } from './use-logout';

type LogoutMenuButtonProps = {
    tooltip?: string;
};

export function LogoutMenuButton({ tooltip }: LogoutMenuButtonProps) {
    const logout = useLogout();

    return (
        <SidebarMenuButton tooltip={tooltip} onClick={logout}>
            <LogOutIcon />
            <span>Logout</span>
        </SidebarMenuButton>
    );
}
