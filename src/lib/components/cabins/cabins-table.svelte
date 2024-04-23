<script lang="ts">
	import { readable } from 'svelte/store';
	import { createTable, createRender, Render, Subscribe } from 'svelte-headless-table';
	import { addSortBy, addTableFilter, addHiddenColumns } from 'svelte-headless-table/plugins';
	import { ArrowUpDownIcon, ChevronDownIcon } from 'lucide-svelte';

	import * as Table from '$lib/components/ui/table';
	import * as Dropdown from '$lib/components/ui/dropdown-menu';
	import { Input } from '$lib/components/ui/input';
	import { formatCurrency } from '$lib/utils';
	import type { Cabin } from '$lib/schemas';
	import CabinsTableActions from './cabins-table-actions.svelte';
	import Button from '../ui/button/button.svelte';

	const SORTABLE_COLUMNS = ['name', 'maxCapacity', 'price'];
	const HIDABLE_COLUMNS = ['id', 'name', 'maxCapacity', 'price', 'image', 'discountPrice'];

	type PartialCabin = Pick<Cabin, 'id' | 'name' | 'maxCapacity' | 'price' | 'discountPrice' | 'image'>;
	export let cabins: PartialCabin[] = [];

	const table = createTable(readable(cabins), {
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns()
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID',
			plugins: {
				sort: { disable: true },
				filter: { exclude: true }
			}
		}),
		table.column({
			accessor: 'image',
			header: 'Image',
			plugins: {
				sort: { disable: true },
				filter: { exclude: true }
			}
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'maxCapacity',
			header: 'Max. Capacity',
			plugins: {
				filter: { exclude: true }
			}
		}),
		table.column({
			accessor: 'price',
			header: 'Price (USD)',
			cell: ({ value }) => formatCurrency(value) || '-',
			plugins: {
				filter: { exclude: true }
			}
		}),
		table.column({
			accessor: 'discountPrice',
			header: 'Discount Price (USD)',
			cell: ({ value }) => formatCurrency(value) || '-',
			plugins: {
				sort: { disable: true },
				filter: { exclude: true }
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: 'Actions',
			cell: ({ value }) => {
				return createRender(CabinsTableActions, { id: value });
			},
			plugins: {
				sort: { disable: true },
				filter: { exclude: true }
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns } =
		table.createViewModel(columns);
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;

	const ids = flatColumns.map((column) => column.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);
</script>

<div class="flex items-center justify-between">
	<div class="flex items-center py-4">
		<Input class="max-w-sm" placeholder="Filter names..." type="text" bind:value={$filterValue} />
	</div>

	<Dropdown.Root>
		<Dropdown.Trigger asChild let:builder>
			<Button variant="outline" class="ml-auto" builders={[builder]}>
				Columns <ChevronDownIcon class="ml-2 size-4" />
			</Button>
		</Dropdown.Trigger>
		<Dropdown.Content>
			{#each flatColumns as col}
				{#if HIDABLE_COLUMNS.includes(col.id)}
					<Dropdown.CheckboxItem bind:checked={hideForId[col.id]}>
						{col.header}
					</Dropdown.CheckboxItem>
				{/if}
			{/each}
		</Dropdown.Content>
	</Dropdown.Root>
</div>

<div class="rounded-md border mb-10 pb-6">
	<Table.Root {...$tableAttrs}>
		{#if $pageRows.length}
			<Table.Caption>A list of all available cabins</Table.Caption>
		{/if}
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head {...attrs}>
									{#if cell.id === 'price' || cell.id === 'discountPrice'}
										<div class="text-right">
											<Render of={cell.render()} />
										</div>
									{:else if SORTABLE_COLUMNS.includes(cell.id)}
										<Button variant="ghost" on:click={props.sort.toggle}>
											<Render of={cell.render()} />
											<ArrowUpDownIcon class="size-4 ml-2" />
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
				<Table.Row>
					<Table.Cell colspan={columns.length}>
						<div class="text-center text-gray-500">No cabins found</div>
					</Table.Cell>
				</Table.Row>
			{/if}

			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									{#if cell.id === 'price' || cell.id === 'discountPrice'}
										<div class="text-right">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'image'}
										<div class="h-16 w-20 overflow-hidden rounded-md bg-gray-200">
											<img
												src={cell.render().toString()}
												alt="Cabin"
												class="h-full w-full object-cover"
											/>
										</div>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
