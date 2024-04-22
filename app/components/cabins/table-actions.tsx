import { Form, Link } from '@remix-run/react';
import { MoreHorizontalIcon, Trash2Icon, EyeIcon, Wand2Icon } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';

interface CabinsTableActionsProps {
	cabinId: string;
}

export function CabinsTableActions({ cabinId }: CabinsTableActionsProps) {
	return (
		<div className="flex justify-end">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon" className="size-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontalIcon size={24} />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuLabel className="flex items-center">
						<Wand2Icon size={14} className="mr-2" />
						Actions
					</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<DropdownMenuItem className="cursor-pointer hover:bg-gray-100" asChild>
						<Link to={`/dashboard/cabins/${cabinId}`} className="flex items-center p-2">
							<EyeIcon size={14} className="mr-2" />
							View Cabin
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
								className="inline-flex h-min w-full cursor-pointer px-2 py-1.5 text-left text-destructive"
							>
								<Trash2Icon size={14} className="mr-2" />
								Delete Cabin
							</Button>
						</Form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
