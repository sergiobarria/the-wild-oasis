import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { api } from '~/_generated/api'
import { Id } from '~/_generated/dataModel'

export function TableActions({ cabinId }: { cabinId: Id<'cabins'> }) {
	const deleteCabin = useMutation(api.cabins.deleteCabin)

	async function handleDeleteCabin() {
		try {
			await deleteCabin({ id: cabinId })
			toast.success('Cabin deleted successfully')
		} catch (err: unknown) {
			console.error('=> 💥 Error deleting cabin: ', err)
			toast.error('Error deleting cabin')
		}
	}

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<span className="sr-only">Open Table Actions Menu</span>
						<MoreHorizontalIcon className="size-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<AlertDialogTrigger asChild>
						<DropdownMenuItem className="text-destructive">
							<Trash2Icon className="mr-2 size-4" />
							Delete
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the cabin from
						the database.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteCabin}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
