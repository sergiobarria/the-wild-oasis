<script lang="ts">
	import { page } from '$app/state';
	import { getCabins } from '$lib/api/cabins.remote';

	import Typography from '../shared/typography.svelte';
	import CabinCard from './cabin-card.svelte';

	const cabins = $derived(await getCabins(page.url.searchParams.get('search') || undefined));
</script>

<div class="mt-8">
	{#if cabins.length === 0}
		<Typography variant="body" size="sm" class="mt-4 text-center text-muted-foreground">
			No cabins found
		</Typography>
	{/if}

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each cabins as cabin}
			<CabinCard {cabin} />
		{/each}
	</div>
</div>
