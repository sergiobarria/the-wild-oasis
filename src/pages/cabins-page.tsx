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

export function CabinsPage() {
	return (
		<Sheet>
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

			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add new Cabin</SheetTitle>
					<SheetDescription>
						Enter the details of the new cabin you want to add.
					</SheetDescription>
				</SheetHeader>

				<div>cabin form</div>
			</SheetContent>
		</Sheet>
	)
}
