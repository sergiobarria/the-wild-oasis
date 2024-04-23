<script lang="ts">
	import { readable } from 'svelte/store';
	import { createTable, createRender, Render, Subscribe } from 'svelte-headless-table';

	import * as Table from '$lib/components/ui/table';
	import CabinsTableActions from './cabin-table-actions.svelte';
	import { formatCurrency } from '$lib/utils';
	import type { Cabin } from '$lib/schemas';

	type PartialCabin = Pick<Cabin, 'id' | 'name' | 'maxCapacity' | 'price' | 'discountPrice' | 'image'>;
	export let cabins: PartialCabin[] = [];

	const table = createTable(readable(cabins));
	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'image',
			header: 'Image'
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'maxCapacity',
			header: 'Max. Capacity'
		}),
		table.column({
			accessor: 'price',
			header: 'Price (USD)',
			cell: ({ value }) => formatCurrency(value) || '-'
		}),
		table.column({
			accessor: 'discountPrice',
			header: 'Discount Price (USD)',
			cell: ({ value }) => formatCurrency(value) || '-'
		}),
		table.column({
			accessor: ({ id }) => id,
			header: 'Actions',
			cell: ({ value }) => {
				return createRender(CabinsTableActions, { id: value });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									{#if cell.id === 'price' || cell.id === 'discountPrice'}
										<div class="text-right">
											<Render of={cell.render()} />
										</div>
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
