import { Form } from '@remix-run/react';
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '~/components/ui/sheet';

interface CabinsTableActionsMenuProps {
	cabinId: number;
}

export function CabinsTableActionsMenu({ cabinId }: CabinsTableActionsMenuProps) {
	return (
		<Sheet>
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

					<DropdownMenuItem>
						<SheetTrigger className="flex items-center">
							<PencilIcon className="mr-2 size-4" />
							Edit Cabin
						</SheetTrigger>
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

			{/* Edit Cabin Sheet Content */}
			<SheetContent>
				<SheetTitle>Edit Cabin</SheetTitle>
			</SheetContent>
		</Sheet>
	);
}
