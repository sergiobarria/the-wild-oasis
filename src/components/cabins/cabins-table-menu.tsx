import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
// import { toast } from 'sonner';

type CabinsTableMenuProps = {
	cabinId: string;
};

export function CabinsTableMenu({ cabinId }: CabinsTableMenuProps) {
	// async function deleteCabin(formData: FormData) {
	// 	const result = await deleteCabinAction(formData);

	// 	if (!result.success) {
	// 		toast.error('Error deleting cabin');
	// 		return;
	// 	}

	// 	toast.success('Cabin deleted successfully');
	// }

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
					<Link to={`cabins/${cabinId}`}>
						<EyeIcon className="mr-3 size-4" />
						View
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild className="cursor-pointer">
					<Link to={`cabins/${cabinId}/edit`}>
						<PencilIcon className="mr-3 size-4" />
						Edit
					</Link>
				</DropdownMenuItem>

				<form>
					<input type="hidden" name="cabinId" value={cabinId} />

					<DropdownMenuItem className="py-0">
						<Button variant="ghost" className="p-0 text-destructive">
							<Trash2Icon className="mr-3 size-4" />
							Delete
						</Button>
					</DropdownMenuItem>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
