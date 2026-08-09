'use client';

import { useRouter } from 'next/navigation';

import { LogOutIcon } from 'lucide-react';

import { SidebarMenuButton } from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { APP_ROUTES } from '@/lib/routes';

type LogoutMenuButtonProps = {
    tooltip?: string;
};

export function LogoutMenuButton({ tooltip }: LogoutMenuButtonProps) {
    const router = useRouter();

    return (
        <SidebarMenuButton
            tooltip={tooltip}
            onClick={() => {
                void authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => router.push(APP_ROUTES.HOME),
                    },
                });
            }}
        >
            <LogOutIcon />
            <span>Logout</span>
        </SidebarMenuButton>
    );
}
