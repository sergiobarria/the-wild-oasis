<script lang="ts">
	import { Debounced } from 'runed';
	import { useSearchParams } from 'runed/kit';

	import { getCabins } from '$lib/api/cabins.remote';
	import { APP_NAME } from '$lib/config/constants';
	import { CabinsSearchParamsSchema } from '$lib/schemas/cabins-search-params';

	const params = useSearchParams(CabinsSearchParamsSchema, {
		debounce: 300
	});

	// Debounce the actual search value used for querying
	const debouncedSearch = new Debounced(() => params.search, 300);

	const query = $derived(getCabins(debouncedSearch.current));
</script>

<svelte:head>
	<title>Cabins - {APP_NAME}</title>
</svelte:head>

<div>
	<input type="text" placeholder="Search cabins..." bind:value={params.search} />

	{#if query.loading}
		<div>
			<span>Loading...</span>
		</div>
	{/if}
</div>

<div>
	{#if query.error}
		<div>
			<p>Failed to load cabins: {query.error.message}</p>
		</div>
	{:else if query.loading && !query.current}
		<!-- Initial loading state (no previous data) -->
		<div>
			<p>Loading cabins...</p>
		</div>
	{:else if query.current}
		{#if query.current.length === 0}
			<p>No cabins found matching "{params.search}"</p>
		{:else}
			<div>
				{#each query.current as cabin (cabin.id)}
					<div>
						<a href={`/cabins/${cabin.slug}`}>
							<h2>{cabin.name}</h2>
						</a>
						<p>{cabin.summary}</p>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
