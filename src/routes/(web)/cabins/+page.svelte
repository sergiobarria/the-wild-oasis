<script lang="ts">
	import { SearchIcon } from '@lucide/svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ActiveCabinFilters from '$lib/components/cabins/active-cabin-filters.svelte';
	import CabinList from '$lib/components/cabins/cabin-list.svelte';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { APP_NAME } from '$lib/config/constants';

	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleSearch(value: string) {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			const params = new URLSearchParams(page.url.searchParams);

			if (value) {
				params.set('search', value);
			} else {
				params.delete('search');
			}

			goto(`?${params.toString()}`, {
				keepFocus: true,
				noScroll: true
			});
		}, 500);
	}

	function removeFilter(filterKey: string) {
		const params = new URLSearchParams(page.url.searchParams);
		params.delete(filterKey);

		goto(`?${params.toString()}`, {
			noScroll: true
		});
	}

	function clearAllFilters() {
		goto('?', { noScroll: true });
	}

	// Get Active filters
	const activeFilters = $derived.by(() => {
		const filters = [];
		const search = page.url.searchParams.get('search');

		if (search) {
			filters.push({
				id: 'search',
				label: 'Search',
				value: search,
				onRemove: () => removeFilter('search')
			});
		}

		// TODO: Add more filters...

		return filters;
	});
</script>

<svelte:head>
	<title>Our Cabins | {APP_NAME}</title>
</svelte:head>

<section class="container mx-auto max-w-6xl px-8 py-12">
	<Typography variant="h1" size="3xl" class="text-primary">Our Luxury Cabins</Typography>
	<Typography variant="body">
		Cozy yet luxurious cabins, located right at the heart of the Italian Dolomites. Imagine waking
		up to beautiful mountain views, spending your days exploring the dark forests around, or just
		relaxing in your private hot tub under the stars. Enjoy nature's beauty in your own little home
		away from home. The perfect spot for a peaceful, calm vacation. Welcome to paradise.
	</Typography>

	<!-- Filters section -->
	<div class="relative mt-8">
		<Input
			placeholder="Search cabins..."
			class="w-full"
			value={page.url.searchParams.get('search') || ''}
			oninput={(e) => handleSearch(e.currentTarget.value)}
		/>
		<SearchIcon class="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
	</div>

	<ActiveCabinFilters filters={activeFilters} onClearAll={clearAllFilters} class="mt-6" />

	<svelte:boundary>
		<CabinList />

		{#snippet failed(error, reset)}
			<div class="flex min-h-[200px] items-center justify-center">
				<div class="text-center">
					<Typography variant="body" size="sm" class="mt-4 text-muted-foreground">
						Something went wrong loading cabins
					</Typography>
					<Button variant="outline" onclick={reset}>Retry</Button>
				</div>
			</div>
		{/snippet}

		{#snippet pending()}
			<div class="flex min-h-[200px] items-center justify-center">
				<div class="text-center">
					<Spinner class="mx-auto size-12 text-primary" />
					<Typography variant="body" size="sm" class="mt-4 text-muted-foreground">
						Loading cabins...
					</Typography>
				</div>
			</div>
		{/snippet}
	</svelte:boundary>

	<!-- {#if query.error}
		<p>oops!</p>
	{:else if query.loading}
		<div class="flex min-h-[400px] items-center justify-center">
			<div class="text-center">
				<Spinner class="mx-auto size-12 text-primary" />
				<p class="mt-4 text-sm text-muted-foreground">Loading cabins...</p>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each query.current as cabin}
				<CabinCard {cabin} />
			{/each}
		</div>
	{/if} -->

	<!-- <div class="mt-8">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each cabins as cabin}
				<CabinCard {cabin} />
			{/each}
		</div>
	</div> -->

	<!-- <svelte:boundary>
		<div class="mt-8">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each cabins as cabin}
					<CabinCard {cabin} />
				{/each}
			</div>
		</div>

		{#snippet pending()}
			<div class="flex min-h-[400px] items-center justify-center">
				<div class="text-center">
					<Spinner class="mx-auto size-12 text-primary" />
					<p class="mt-4 text-sm text-muted-foreground">Loading cabins...</p>
				</div>
			</div>
		{/snippet}
	</svelte:boundary> -->
</section>
