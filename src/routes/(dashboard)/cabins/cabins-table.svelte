<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns
	} from 'svelte-headless-table/plugins';
	import {
		ChevronLeftIcon,
		ChevronRightIcon,
		ArrowUpDownIcon,
		ChevronDownIcon
	} from 'lucide-svelte';

	import * as Table from '$lib/components/ui/table';
	import * as Dropdown from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { Cabin } from '$lib/validators/cabin';
	import { formatCurrency } from '$lib/utils';
	import CabinsTableActions from './cabins-table-actions.svelte';

	export let data: Omit<Cabin, 'description'>[];
	const numberTypeColumns = ['max_capacity', 'price', 'discount_price'];
	const sortableColumns = ['name', 'max_capacity', 'price', 'discount_price'];

	const table = createTable(readable(data), {
		page: addPagination({ initialPageSize: 5 }),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => {
				return value.toLowerCase().includes(filterValue.toLowerCase());
			}
		}),
		hide: addHiddenColumns({
			initialHiddenColumnIds: []
		})
	});
	const columns = table.createColumns([
		// table.column({
		// 	accessor: 'id',
		// 	header: 'ID',
		// 	plugins: {
		// 		sort: { disable: true },
		// 		filter: { exclude: true }
		// 	}
		// }),
		table.column({
			accessor: 'image',
			header: 'Cabin Image'
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'max_capacity',
			header: 'Max Capacity',
			plugins: {
				filter: { exclude: true }
			}
		}),
		table.column({
			accessor: 'price',
			header: 'Price',
			plugins: {
				filter: { exclude: true }
			},
			cell: ({ value }) => {
				const formatted = formatCurrency(value / 100); // Convert cents to dollars and format
				return formatted;
			}
		}),
		table.column({
			accessor: 'discount_price',
			header: 'Discount Price',
			plugins: {
				filter: { exclude: true }
			},
			cell: ({ value }) => {
				const formatted = formatCurrency(value / 100); // Convert cents to dollars and format
				return formatted;
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: 'Actions',
			plugins: {
				sort: { disable: true },
				filter: { exclude: true }
			},
			cell: ({ value }) => {
				return createRender(CabinsTableActions, { id: value });
			}
		})
	]);

	const { headerRows, pageRows, tableBodyAttrs, tableAttrs, pluginStates, flatColumns } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	const hidableCols = ['id', 'name', 'max_capacity', 'price', 'discount_price'];
</script>

<div class="mb-6 flex justify-between">
	<Input
		type="text"
		class="max-w-md"
		placeholder="Filter by cabin name..."
		bind:value={$filterValue}
	/>

	<Dropdown.Root>
		<Dropdown.Trigger asChild let:builder>
			<Button variant="outline" class="ml-auto" builders={[builder]}>
				Columns <ChevronDownIcon class="ml-2 size-4" />
			</Button>
		</Dropdown.Trigger>

		<Dropdown.Content>
			{#each flatColumns as col}
				{#if hidableCols.includes(col.id)}
					<Dropdown.CheckboxItem bind:checked={hideForId[col.id]}>
						{col.header}
					</Dropdown.CheckboxItem>
				{/if}
			{/each}
		</Dropdown.Content>
	</Dropdown.Root>
</div>

<div class="rounded-lg border">
	<Table.Root {...$tableAttrs}>
		<Table.Caption class="pb-3">Show all available cabins list</Table.Caption>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe
								attrs={cell.attrs()}
								props={cell.props()}
								let:attrs
								let:props
							>
								<Table.Head {...attrs}>
									{#if numberTypeColumns.includes(cell.id) && sortableColumns.includes(cell.id)}
										<div class="flex justify-end">
											<Button
												variant="ghost"
												on:click={props.sort.toggle}
												class="p-0"
											>
												<Render of={cell.render()} />
												<ArrowUpDownIcon class="ml-2 size-4" />
											</Button>
										</div>
									{:else if numberTypeColumns.includes(cell.id)}
										<div class="text-right">
											<Render of={cell.render()} />
										</div>
									{:else if sortableColumns.includes(cell.id)}
										<Button
											variant="ghost"
											on:click={props.sort.toggle}
											class="p-0"
										>
											<Render of={cell.render()} />
											<ArrowUpDownIcon class="ml-2 size-4" />
										</Button>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>

		<Table.Body {...$tableBodyAttrs}>
			{#if $pageRows.length === 0}
				<td colspan={columns.length} class="p-4 text-center text-muted-foreground">
					No results found.
				</td>
			{:else}
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if numberTypeColumns.includes(cell.id)}
											<div class="text-right">
												<Render of={cell.render()} />
											</div>
										{:else if cell.id === 'image'}
											<img
												src={cell.render().toString()}
												alt={cell.render().toString()}
												class="h-auto w-20 rounded-lg"
											/>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
</div>

<!-- Pagination Filters -->
<div class="mt-5 flex justify-end space-x-4">
	<Button
		variant="outline"
		size="sm"
		on:click={() => ($pageIndex = $pageIndex - 1)}
		disabled={!$hasPreviousPage}
	>
		<ChevronLeftIcon class="size-4" />
	</Button>

	<Button
		variant="outline"
		size="sm"
		on:click={() => ($pageIndex = $pageIndex + 1)}
		disabled={!$hasNextPage}
	>
		<ChevronRightIcon class="size-4" />
	</Button>
</div>
