import { Form, Link } from '@remix-run/react';
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';

interface CabinsTableActionsMenuProps {
	cabinId: number;
}

export function CabinsTableActionsMenu({ cabinId }: CabinsTableActionsMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="size-8 p-0">
					<span className="sr-only">Open Menu</span>
					<MoreHorizontalIcon className="size-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem asChild className="cursor-pointer">
					<Link to={`/dashboard/cabins/${cabinId}`} className="flex items-center">
						<EyeIcon className="mr-2 size-4" />
						View Details
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className="p-0">
					<Form method="POST">
						<input type="hidden" name="cabinID" value={cabinId} />

						<Button
							type="submit"
							variant="ghost"
							name="_action"
							value="delete"
							className="text-destructive inline-flex h-min w-full cursor-pointer px-2 py-1.5 text-left"
						>
							<Trash2Icon className="mr-2 size-4" />
							Delete Cabin
						</Button>
					</Form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
