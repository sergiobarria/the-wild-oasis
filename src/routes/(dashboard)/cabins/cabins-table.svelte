<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';

	import * as Table from '$lib/components/ui/table';
	import type { Cabin } from '$lib/validators/cabin';
	import { formatCurrency } from '$lib/utils';
	import CabinsTableActions from './cabins-table-actions.svelte';

	export let data: Omit<Cabin, 'description'>[];
	const numberTypeColumns = ['max_capacity', 'price', 'discount_price'];

	const table = createTable(readable(data));
	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'max_capacity',
			header: 'Max Capacity'
		}),
		table.column({
			accessor: 'price',
			header: 'Price',
			cell: ({ value }) => {
				const formatted = formatCurrency(value / 100); // Convert cents to dollars and format
				return formatted;
			}
		}),
		table.column({
			accessor: 'discount_price',
			header: 'Discount Price',
			cell: ({ value }) => {
				const formatted = formatCurrency(value / 100); // Convert cents to dollars and format
				return formatted;
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: 'Actions',
			cell: ({ value }) => {
				return createRender(CabinsTableActions, { id: value });
			}
		})
	]);

	const { headerRows, pageRows, tableBodyAttrs, tableAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-lg border bg-white shadow-md">
	<Table.Root {...$tableAttrs}>
		<Table.Caption class="pb-3">Show all available cabins list</Table.Caption>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} props={cell.props()} let:attrs>
								<Table.Head {...attrs}>
									{#if numberTypeColumns.includes(cell.id)}
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
