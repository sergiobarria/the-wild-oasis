import { useState } from 'react'
import { PlusCircleIcon } from 'lucide-react'

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { CabinsTable } from '@/components/cabins/cabins-table'
import { Button } from '@/components/ui/button'
import { CabinsForm } from '@/components/cabins/cabins-form'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CabinsPage() {
	const [sheetOpen, setSheetOpen] = useState<boolean>(false)

	function handleCloseSheet() {
		setSheetOpen(false)
	}

	return (
		<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">All Cabins</h1>
				<SheetTrigger asChild>
					<Button size="sm">
						<PlusCircleIcon className="mr-2 size-4" />
						Add New Cabin
					</Button>
				</SheetTrigger>
			</div>

			<div className="my-10 pb-6">
				<CabinsTable />
			</div>

			<SheetContent className="w-[400px] sm:w-[540px] lg:max-w-none">
				<SheetHeader className="pb-4">
					<SheetTitle>Add new Cabin</SheetTitle>
					<SheetDescription>
						Enter the details of the new cabin you want to add.
					</SheetDescription>
				</SheetHeader>

				<ScrollArea className="h-full pb-10 pr-6">
					<CabinsForm onSubmitComplete={handleCloseSheet} />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
