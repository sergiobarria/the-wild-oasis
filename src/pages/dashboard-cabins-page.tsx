import { Suspense } from 'react';
import { PlusIcon } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CabinsForm } from '@/components/cabins/cabins-form';
import { CabinsTable } from '@/components/cabins/cabins-table';

export function DashboardCabinPage() {
	return (
		<Sheet>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold tracking-wide">All Cabins</h1>
				<Button size="sm" asChild>
					<SheetTrigger>
						<PlusIcon size={16} className="mr-2" />
						Add Cabin
					</SheetTrigger>
				</Button>
			</div>

			<div>
				<Suspense fallback={<div>Loading...</div>}>
					<CabinsTable />
				</Suspense>
			</div>

			<SheetContent className="w-[400px] sm:w-[540px] md:w-[1670px]">
				<SheetHeader>
					<SheetTitle>Add New Cabin</SheetTitle>
					<SheetDescription>
						This form will allow you to add a new cabin to the system. Please fill out the form below to add
						a new cabin.
					</SheetDescription>

					<div>
						<CabinsForm />
					</div>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
