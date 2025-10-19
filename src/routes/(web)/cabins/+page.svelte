<script lang="ts">
	import { SearchIcon } from '@lucide/svelte';
	import { Debounced } from 'runed';
	import { useSearchParams } from 'runed/kit';

	import { getCabins } from '$lib/api/cabins.remote';
	import type { FilterItem } from '$lib/components/cabins/active-filters.svelte';
	import ActiveFilters from '$lib/components/cabins/active-filters.svelte';
	import CabinCard from '$lib/components/cabins/cabin-card.svelte';
	import Typography from '$lib/components/shared/typography.svelte';
	import {
		Empty,
		EmptyDescription,
		EmptyHeader,
		EmptyMedia,
		EmptyTitle
	} from '$lib/components/ui/empty';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { APP_NAME } from '$lib/config/constants';
	import { CabinsSearchParamsSchema } from '$lib/schemas/cabins-search-params';

	const params = useSearchParams(CabinsSearchParamsSchema, {
		debounce: 300,
		noScroll: true // Prevent automatic scrolling on param changes
	});

	// Debounce the actual search value used for querying
	const debouncedSearch = new Debounced(() => params.search, 300);

	const query = $derived(getCabins(debouncedSearch.current));
	const search = $derived(params.search);

	const filters: FilterItem[] = $derived.by(() => {
		const filters: FilterItem[] = [];

		if (search) {
			filters.push({
				key: 'search',
				label: 'Search',
				value: search
			});
		}

		// Add other filters here as needed...
		// ...

		return filters;
	});

	const handleRemoveFilter = (key: string) => {
		if (key === 'search') {
			params.update({ search: '' });
		}
	};

	const handleClearAll = () => {
		params.update({
			search: ''
			// Reset other filters here as needed...
		});
	};
</script>

<svelte:head>
	<title>Cabins - {APP_NAME}</title>
</svelte:head>

{#snippet loadingCabins()}
	<div class="flex min-h-[200px] items-center justify-center">
		<div class="text-center">
			<Spinner class="mx-auto size-12 text-primary" />
			<Typography variant="body" size="sm" class="mt-4 text-muted-foreground">
				Loading cabins...
			</Typography>
		</div>
	</div>
{/snippet}

{#snippet emptyResults()}
	<Empty>
		<EmptyHeader>
			<EmptyMedia variant="icon">
				<SearchIcon />
			</EmptyMedia>
			<EmptyTitle>No Cabins Found</EmptyTitle>
			<EmptyDescription>
				We couldn't find any cabins matching your search. Try adjusting your filters or search term.
			</EmptyDescription>
		</EmptyHeader>
	</Empty>
{/snippet}

<section class="container mx-auto max-w-7xl px-8 py-12">
	<Typography variant="h1" size="3xl" class="text-primary">Our Luxury Cabins</Typography>
	<Typography variant="body">
		Cozy yet luxurious cabins, located right at the heart of the Italian Dolomites. Imagine waking
		up to beautiful mountain views, spending your days exploring the dark forests around, or just
		relaxing in your private hot tub under the stars. Enjoy nature's beauty in your own little home
		away from home. The perfect spot for a peaceful, calm vacation. Welcome to paradise.
	</Typography>

	<div class="relative my-8">
		<Input placeholder="Search cabins..." class="w-full" bind:value={params.search} />
		{#if query.loading}
			<Spinner class="absolute top-1/2 right-3 size-4 -translate-y-1/2" />
		{:else}
			<SearchIcon class="absolute top-1/2 right-3 size-4 -translate-y-1/2" />
		{/if}
	</div>

	<ActiveFilters
		{filters}
		onRemoveFilter={handleRemoveFilter}
		onClearAll={handleClearAll}
		class="mb-6"
	/>

	<div>
		{#if query.error}
			<div>
				<p>Failed to load cabins: {query.error.message}</p>
			</div>
		{:else if query.loading}
			{@render loadingCabins()}
		{:else if query.current}
			{#if query.current.length === 0}
				{@render emptyResults()}
			{:else}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each query.current as cabin (cabin.id)}
						<CabinCard {cabin} />
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</section>
