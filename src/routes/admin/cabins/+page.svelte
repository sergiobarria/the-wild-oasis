<script lang="ts">
	import type { PageProps } from './$types';
	import CabinsTable from './cabins-table.svelte';

	let { data }: PageProps = $props();
</script>

<h1 class="scroll-m-20 text-3xl font-extrabold tracking-wider lg:text-4xl">Cabins</h1>

<div class="mt-6">
	<svelte:boundary>
		<CabinsTable />

		{#snippet pending()}
			<p>Loading cabins...</p>
		{/snippet}
	</svelte:boundary>
</div>
