<script lang="ts">
	import { SearchIcon } from '@lucide/svelte';

	import CabinCard from '$lib/components/cabins/cabin-card.svelte';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { APP_NAME } from '$lib/config/constants';

	import { getCabins } from './queries.remote';
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
		<Input placeholder="Search cabins..." class="w-full" />
		<SearchIcon class="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
	</div>

	<div class="my-8">filters</div>

	<svelte:boundary>
		<div class="mt-8">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each await getCabins() as cabin}
					<CabinCard {cabin} />
				{/each}
			</div>
		</div>

		{#snippet pending()}
			<div class="flex min-h-[400px] items-center justify-center">
				<div class="text-center">
					<!-- Spinner -->
					<Spinner class="mx-auto size-12 text-primary" />
					<!-- Text -->
					<p class="mt-4 text-sm text-muted-foreground">Loading cabins...</p>
				</div>
			</div>
		{/snippet}
	</svelte:boundary>
</section>
