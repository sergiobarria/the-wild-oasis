import { useFetcher, useNavigate } from '@remix-run/react';
import { MoreHorizontalIcon, Trash2Icon, PencilIcon, Wand2Icon } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Cabin } from '~/lib/validation/cabin';
import { useToast } from '~/hooks/use-toast';
import { useEffect } from 'react';

interface CabinsTableActionsProps {
	cabin: Omit<Cabin, 'description' | 'createdAt' | 'updatedAt'>;
}

export function CabinsTableActions({ cabin }: CabinsTableActionsProps) {
	const navigate = useNavigate();
	const fetcher = useFetcher<{ success: boolean; message?: string }>();
	const { toast } = useToast();

	useEffect(() => {
		if (fetcher.data?.success) {
			toast({
				title: 'Success!',
				description: 'The cabin has been deleted successfully',
			});
		}

		if (fetcher.data?.success === false) {
			toast({
				variant: 'destructive',
				title: 'Oops! Something went wrong.',
				description: 'An error occurred while deleting the cabin. Please try again.',
			});
		}
	}, [fetcher.data, toast]);

	function handleDeleteAction() {
		const proceed = confirm('Are you sure you want to delete this cabin?');
		console.log('🚀 ~ handleDeleteAction ~ proceed:', proceed);
		if (!proceed) return;
	}

	function handleEditClick(cabinSlug: string) {
		navigate(`/dashboard/cabins/${cabinSlug}`);
	}

	return (
		<div className="flex justify-end">
			{/* <AlertDialog> */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="size-8 p-0">
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

					<DropdownMenuItem
						className="cursor-pointer hover:bg-gray-100"
						onClick={() => handleEditClick(cabin.slug)}
					>
						<PencilIcon size={14} className="mr-2" />
						Edit Cabin
					</DropdownMenuItem>

					<DropdownMenuItem className="p-0">
						{/* <AlertDialogTrigger asChild> */}
						<fetcher.Form method="POST" onSubmit={handleDeleteAction}>
							<input type="hidden" name="cabinID" value={cabin.id} />

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
						</fetcher.Form>
						{/* </AlertDialogTrigger> */}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
