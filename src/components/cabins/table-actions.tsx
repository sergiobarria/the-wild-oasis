import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

				<DropdownMenuItem className="text-destructive" onClick={handleDeleteCabin}>
					<Trash2Icon className="mr-2 size-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
