<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { PlusIcon } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Cabins</title>
</svelte:head>

<div class="mb-4 flex items-center">
	<h1 class="text-3xl font-bold tracking-wide">All Cabins</h1>
	<Button href="cabins/add" class="ml-auto">
		<PlusIcon class="mr-2 size-4" />
		Add Cabin
	</Button>
</div>
{#each data.cabins as cabin}
	<div>{cabin.name}</div>
	<div>{cabin.max_capacity}</div>
	<div>{cabin.price}</div>
{/each}
