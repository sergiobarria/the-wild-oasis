'use client';

import { MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Cabin } from '@/database/schemas';

export function CabinsTableActions({ cabin }: { cabin: Omit<Cabin, 'description' | 'updatedAt'> }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="size-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreVertical className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
				//   onClick={() => navigator.clipboard.writeText(payment.id)}
				>
					Copy payment ID
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>View customer</DropdownMenuItem>
				<DropdownMenuItem>View payment details</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
