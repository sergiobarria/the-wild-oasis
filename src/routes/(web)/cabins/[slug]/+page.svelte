<script lang="ts">
	import { page } from '$app/state';
	import { getCabinBySlug } from '$lib/api/cabins.remote';
	import { APP_NAME } from '$lib/config/constants';

	const cabin = $derived(await getCabinBySlug(page.params.slug));
</script>

<svelte:head>
	<title>{cabin.name} - {APP_NAME}</title>
</svelte:head>

{cabin.name}
