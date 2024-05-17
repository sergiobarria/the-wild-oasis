import { useState } from 'react'
import { CopyIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CabinsForm } from '@/components/cabins/cabins-form'
import { api } from '~/_generated/api'
import { Doc } from '~/_generated/dataModel'

interface TableActionsProps {
	cabin: Doc<'cabins'> & { imageUrl: string }
}

export function TableActions({ cabin }: TableActionsProps) {
	const [sheetOpen, setSheetOpen] = useState<boolean>(false)
	const createCabinMutation = useMutation(api.cabins.create)
	const deleteCabin = useMutation(api.cabins.deleteCabin)

	function handleCloseSheet() {
		setSheetOpen(false)
	}

	async function handleDuplicateCabin() {
		try {
			await createCabinMutation({
				name: `Copy of ${cabin.name}`,
				maxCapacity: cabin.maxCapacity,
				price: cabin.price * 100,
				discount: cabin.discount * 100,
				description: cabin.description,
			})
			toast.success('Cabin duplicated successfully')
		} catch (err: unknown) {
			console.error('=> 💥 Error duplicating cabin: ', err)
			toast.error('Error duplicating cabin')
		}
	}

	async function handleDeleteCabin() {
		try {
			await deleteCabin({ id: cabin._id })
			toast.success('Cabin deleted successfully')
		} catch (err: unknown) {
			console.error('=> 💥 Error deleting cabin: ', err)
			toast.error('Error deleting cabin')
		}
	}

	return (
		<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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

						<DropdownMenuItem onClick={handleDuplicateCabin}>
							<CopyIcon className="mr-2 size-4" />
							Duplicate
						</DropdownMenuItem>

						<SheetTrigger asChild>
							<DropdownMenuItem>
								<PencilIcon className="mr-2 size-4" />
								Edit
							</DropdownMenuItem>
						</SheetTrigger>

						<AlertDialogTrigger asChild>
							<DropdownMenuItem className="text-destructive">
								<Trash2Icon className="mr-2 size-4" />
								Delete
							</DropdownMenuItem>
						</AlertDialogTrigger>
					</DropdownMenuContent>
				</DropdownMenu>

				<SheetContent className="w-[400px] sm:w-[540px] lg:max-w-none">
					<SheetHeader className="pb-4">
						<SheetTitle>Add new Cabin</SheetTitle>
						<SheetDescription>
							Enter the details of the new cabin you want to add.
						</SheetDescription>
					</SheetHeader>

					<ScrollArea className="h-full pb-10 pr-6">
						<CabinsForm cabin={cabin} onSubmitComplete={handleCloseSheet} />
					</ScrollArea>
				</SheetContent>

				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the cabin
							from the database.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteCabin}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Sheet>
	)
}
