import { NavLink } from 'react-router-dom';
import { CalendarDaysIcon, HomeIcon, SettingsIcon, TreesIcon, Users2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Bookings', href: '/bookings', icon: CalendarDaysIcon },
    { name: 'Cabins', href: '/cabins', icon: TreesIcon },
    { name: 'Users', href: '/users', icon: Users2Icon },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function MainNavigation() {
    return (
        <nav>
            <ul className="flex flex-col gap-3">
                {navigation.map(item => (
                    <li key={item.name} className="group text-sm">
                        <NavLink
                            to={item.href}
                            className={({ isActive }) => {
                                return cn(
                                    'flex items-center gap-3 rounded-md px-5 py-3 text-neutral-600 hover:bg-neutral-100',
                                    {
                                        'bg-neutral-100 text-primary': isActive,
                                    },
                                );
                            }}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        className={cn(
                                            'h-5 w-5 opacity-70 group-hover:text-primary',
                                            {
                                                'text-primary opacity-100': isActive,
                                            },
                                        )}
                                    />
                                    <span>{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
