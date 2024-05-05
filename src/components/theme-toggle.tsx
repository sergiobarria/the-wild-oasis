import { MoonStarIcon, SunIcon } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="flex items-center rounded-lg p-2 text-muted-foreground hover:bg-gray-200 dark:hover:text-black"
					title="Toggle Theme"
				>
					<SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonStarIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>

				<DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>

				<DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
