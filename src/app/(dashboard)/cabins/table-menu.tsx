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
import Link from 'next/link';
// import { deleteCabinAction } from './_actions';
import { toast } from 'sonner';

type CabinsTableMenuProps = {
	cabinId: string;
};

export function CabinsTableMenu({ cabinId }: CabinsTableMenuProps) {
	async function deleteCabin(formData: FormData) {
		// const result = await deleteCabinAction(formData);
		// if (!result.success) {
		// 	toast.error('Error deleting cabin');
		// 	return;
		// }
		// toast.success('Cabin deleted successfully');
	}

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
					<Link href={`cabins/${cabinId}`}>
						<EyeIcon className="mr-3 size-4" />
						View
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild className="cursor-pointer">
					<Link href={`cabins/${cabinId}/edit`}>
						<PencilIcon className="mr-3 size-4" />
						Edit
					</Link>
				</DropdownMenuItem>

				<form action={deleteCabin}>
					<input type="hidden" name="cabinId" value={cabinId} />

					<DropdownMenuItem className="py-0">
						<Button variant="ghost" className="text-destructive p-0">
							<Trash2Icon className="mr-3 size-4" />
							Delete
						</Button>
					</DropdownMenuItem>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
