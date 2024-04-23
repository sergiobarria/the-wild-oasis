<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { ChevronLeftIcon, PencilIcon } from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Cabin Details | HBS</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div>
		<Button variant="outline" size="icon" class="mb-3" on:click={() => goto('/dashboard/cabins')}>
			<ChevronLeftIcon class="size-6" />
		</Button>
		<h1 class="text-3xl font-bold mb-6">Cabin Details</h1>
	</div>

	<Button on:click={() => goto(`/dashboard/cabins/${$page.params.id}/edit`)}>
		<PencilIcon class="size-4 mr-2" />
		Edit Cabin
	</Button>
</div>
