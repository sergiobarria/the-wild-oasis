<script lang="ts">
	import { XIcon } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface Filter {
		id: string;
		label: string;
		value: string;
		onRemove?: () => void;
	}

	interface Props {
		filters: Filter[];
		onClearAll?: () => void;
		class?: string;
	}

	let { filters, onClearAll, class: className }: Props = $props();

	const hasFilters = $derived(filters.length > 0);
</script>

{#snippet filterBadge(label: string, value: string, onRemove?: () => void)}
	<div
		class="inline-flex items-center gap-1.5 rounded-md border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors"
	>
		<span class="text-muted-foreground">{label}:</span>
		<span class="font-semibold">{value}</span>

		{#if onRemove}
			<button
				type="button"
				onclick={onRemove}
				class="ml-0.5 inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none"
				aria-label="Remove {label} filter"
			>
				<XIcon class="size-3" />
			</button>
		{/if}
	</div>
{/snippet}

{#if hasFilters}
	<div
		class={cn(
			'flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed bg-muted/10 p-3',
			className
		)}
	>
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-sm font-medium text-muted-foreground">Active Filters:</span>

			{#each filters as filter (filter.id)}
				{@render filterBadge(filter.label, filter.value, filter.onRemove)}
			{/each}
		</div>

		{#if onClearAll}
			<Button
				variant="ghost"
				size="sm"
				onclick={onClearAll}
				class="shrink-0 text-xs hover:text-destructive"
			>
				Clear All
			</Button>
		{/if}
	</div>
{/if}
