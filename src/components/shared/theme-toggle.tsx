import { MoonStarIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/context/theme-provider'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative overflow-hidden">
                    {/* Sun icon with glow effect */}
                    <SunIcon className="text-primary h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all duration-500 dark:scale-0 dark:rotate-180" />

                    {/* Moon icon with subtle glow */}
                    <MoonStarIcon className="text-primary absolute h-[1.2rem] w-[1.2rem] scale-0 -rotate-180 transition-all duration-500 dark:scale-100 dark:rotate-0" />

                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem checked={theme === 'light'} onCheckedChange={(v) => v && setTheme('light')}>
                    Light
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={theme === 'dark'} onCheckedChange={(v) => v && setTheme('dark')}>
                    Dark
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={theme === 'system'} onCheckedChange={(v) => v && setTheme('system')}>
                    System
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
