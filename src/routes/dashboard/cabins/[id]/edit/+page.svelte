<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { ChevronLeftIcon } from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
</script>

<svelte:head>
	<title>Edit Cabin | HBS</title>
</svelte:head>

<Button variant="outline" size="icon" class="mb-3" on:click={() => goto('/dashboard/cabins/' + $page.params.id)}>
	<ChevronLeftIcon class="size-6" />
</Button>
<h1 class="text-3xl font-bold mb-6">Edit Cabin</h1>

<p>Editing Cabin with ID: {data.cabin.id}</p>
