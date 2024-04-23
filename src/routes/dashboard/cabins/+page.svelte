<script lang="ts">
	import type { PageData } from './$types';

	import CabinsTable from '$lib/components/cabins/cabins-table.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Cabins | HBS</title>
</svelte:head>

<h1 class="text-3xl font-bold mb-6">All Cabins</h1>

<CabinsTable cabins={data.cabins} />
