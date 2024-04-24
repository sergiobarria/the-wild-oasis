import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	SortingState,
	getSortedRowModel,
	getFilteredRowModel,
	VisibilityState
} from '@tanstack/react-table';
import { useState } from 'react';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Button } from './button';
import { Input } from './input';
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent } from './dropdown-menu';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		id: false
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: { sorting, columnFilters, columnVisibility }
	});

	return (
		<>
			<div className="flex items-center pb-4">
				<Input
					placeholder="Filter by cabin name..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
					className="max-w-sm placeholder:font-light"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto flex min-w-44 justify-between">
							Columns
							<ChevronDown size={16} className="ml-2" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end" className="space-y-1 p-2">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
										className="flex cursor-pointer items-center gap-1 px-0.5 py-1 text-sm capitalize"
									>
										{column.getIsVisible() ? <CheckIcon size={14} /> : <div className="size-4" />}
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="rounded-md border">
				<Table>
					{table.getRowModel().rows?.length > 0 && (
						<TableCaption>A list of all available Cabins</TableCaption>
					)}
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center text-gray-600">
									No data available
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
