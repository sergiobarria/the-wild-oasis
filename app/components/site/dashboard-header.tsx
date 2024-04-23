import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils/helpers';

interface DashboardHeaderProps {
	isDrawerOpen: boolean;
	toggleDrawer: () => void;
}

export function DashboardHeader({ toggleDrawer, isDrawerOpen }: DashboardHeaderProps) {
	return (
		<header
			className={cn(
				'bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static',
				'sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'
			)}
		>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" className="p-0 text-gray-600" onClick={toggleDrawer}>
							{isDrawerOpen ? <PanelLeftCloseIcon size={24} /> : <PanelLeftOpenIcon size={24} />}
						</Button>
					</TooltipTrigger>
					<TooltipContent>{isDrawerOpen ? 'Close Sidebar' : 'Open Sidebar'}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			header
		</header>
	);
}
