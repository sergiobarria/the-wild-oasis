<script lang="ts">
	import Typography from '$lib/components/shared/typography.svelte';
	import { APP_NAME } from '$lib/config/constants';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
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
</section>
