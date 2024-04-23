<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { ChevronLeftIcon } from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Cabin Details | HBS</title>
</svelte:head>

<Button variant="outline" size="icon" class="mb-3" on:click={() => goto('/cabins')}>
	<ChevronLeftIcon class="size-6" />
</Button>
<h1 class="text-3xl font-bold mb-6">Cabin Details</h1>

<pre>{JSON.stringify(data, null, 2)}</pre>
