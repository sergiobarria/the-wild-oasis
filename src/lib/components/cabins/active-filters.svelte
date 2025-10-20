<script lang="ts" module>
	export interface FilterItem {
		key: string;
		label: string;
		value: string;
	}
</script>

<script lang="ts">
	import { XIcon } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface ActiveFilterProps {
		filters: FilterItem[];
		onRemoveFilter: (key: string) => void;
		onClearAll: () => void;
		class?: string;
	}

	let { filters, onRemoveFilter, onClearAll, class: className }: ActiveFilterProps = $props();
</script>

{#snippet filterBadge({
	label,
	value,
	onRemove
}: {
	label: string;
	value: string;
	onRemove: () => void;
})}
	<div
		class="inline-flex items-center gap-1.5 rounded-md border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors"
	>
		<span class="text-muted-foreground">{label}:</span>
		<span class="font-semibold">{value}</span>
		<button
			type="button"
			onclick={onRemove}
			class="ml-0.5 inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none"
			aria-label={`Remove ${label} filter`}
		>
			<XIcon class="size-3" />
		</button>
	</div>
{/snippet}

{#if filters.length > 0}
	<div
		class={cn(
			'flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed bg-muted/10 p-3',
			className
		)}
	>
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-sm font-medium text-muted-foreground">
				Active Filter{filters.length > 1 ? 's' : ''}:
			</span>

			{#each filters as filter}
				{@render filterBadge({
					label: filter.label,
					value: filter.value,
					onRemove: () => onRemoveFilter(filter.key)
				})}
			{/each}
		</div>

		<Button
			variant="ghost"
			size="sm"
			onclick={onClearAll}
			class="shrink-0 text-xs hover:text-destructive"
		>
			Clear All
		</Button>
	</div>
{/if}
